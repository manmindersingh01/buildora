import Anthropic from '@anthropic-ai/sdk';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { promises as fs } from 'fs';
import { join, basename, dirname } from 'path';

// Types
interface ProjectFile {
  name: string;
  path: string;
  relativePath: string;
  content: string;
  lines: number;
  size: number;
  snippet: string;
  componentName: string | null;
  hasButtons: boolean;
  hasSignin: boolean;
  isMainFile: boolean;
}

interface ASTNode {
  id: string;
  type: string;
  tagName?: string;
  textContent: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  codeSnippet: string;
  fullContext: string;
  isButton: boolean;
  hasSigninText: boolean;
  attributes?: string[];
}

interface CodeRange {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  originalCode: string;
}

interface ModificationResult {
  success: boolean;
  selectedFiles?: string[];
  approach?: 'FULL_FILE' | 'TARGETED_NODES';
  modifiedRanges?: Array<{
    file: string;
    range: CodeRange;
    modifiedCode: string;
  }>;
  error?: string;
}

export class IntelligentFileModifier {
  private anthropic: Anthropic;
  private reactBasePath: string;
  private projectFiles: Map<string, ProjectFile>;

  constructor(anthropic: Anthropic, reactBasePath: string) {
    this.anthropic = anthropic;
    this.reactBasePath = reactBasePath;
    this.projectFiles = new Map();
  }

  // STEP 1: Build project file tree + metadata
  private async buildProjectTree(): Promise<void> {
    const srcPath = join(this.reactBasePath, 'src');
    
    try {
      await fs.access(srcPath);
      console.log(`📁 Building project tree from: ${srcPath}`);
    } catch (error) {
      console.error(`❌ src directory not found: ${srcPath}`);
      return;
    }
    
    const scanDir = async (dir: string, relativePath: string = ''): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          const relPath = relativePath ? join(relativePath, entry.name) : entry.name;
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDir(fullPath, relPath);
          } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
            await this.analyzeFile(fullPath, relPath);
          }
        }
      } catch (error) {
        console.error(`❌ Error scanning directory ${dir}:`, error);
      }
    };

    await scanDir(srcPath);
    console.log(`✅ Project tree built. Found ${this.projectFiles.size} React files.`);
  }

  // Analyze individual file for metadata
  private async analyzeFile(filePath: string, relativePath: string): Promise<void> {
    try {
      // Skip UI components folder
      if (relativePath.includes('components/ui/') || relativePath.includes('components\\ui\\')) {
        console.log(`⏭️ Skipping UI component: ${relativePath}`);
        return;
      }

      const content = await fs.readFile(filePath, 'utf8');
      const stats = await fs.stat(filePath);
      const lines = content.split('\n');
      
      const projectFile: ProjectFile = {
        name: basename(filePath),
        path: filePath,
        relativePath: `src/${relativePath}`,
        content,
        lines: lines.length,
        size: stats.size,
        snippet: lines.slice(0, 15).join('\n'),
        componentName: this.extractComponentName(content),
        hasButtons: this.checkForButtons(content),
        hasSignin: this.checkForSignin(content),
        isMainFile: this.isMainFile(filePath, content)
      };
      
      this.projectFiles.set(projectFile.relativePath, projectFile);
      console.log(`📄 Analyzed: ${projectFile.relativePath} (${lines.length} lines, buttons: ${projectFile.hasButtons}, signin: ${projectFile.hasSignin})`);
    } catch (error) {
      console.error(`Failed to analyze file ${relativePath}:`, error);
    }
  }

  // Fallback: Go through all files one by one to find relevant content
  private async fallbackFileSearch(prompt: string): Promise<{ files: string[]; scope: 'FULL_FILE' | 'TARGETED_NODES' }> {
    console.log(`🔍 FALLBACK: No files identified by Claude, searching all files one by one...`);
    console.log(`📁 Searching through ${this.projectFiles.size} files for: "${prompt}"`);
    
    if (this.projectFiles.size === 0) {
      console.log('❌ No files to search through');
      return { files: [], scope: 'TARGETED_NODES' };
    }
    
    const searchTerms = prompt.toLowerCase().split(' ');
    const matches: Array<{ file: ProjectFile; score: number }> = [];
    
    console.log(`🔎 Searching for terms: ${searchTerms.join(', ')}`);
    
    for (const [relativePath, file] of this.projectFiles.entries()) {
      let score = 0;
      const fileContentLower = file.content.toLowerCase();
      
      console.log(`\n📄 Checking: ${relativePath}`);
      console.log(`   - Has buttons: ${file.hasButtons}`);
      console.log(`   - Has signin: ${file.hasSignin}`);
      console.log(`   - Is main file: ${file.isMainFile}`);
      
      // Score based on prompt keywords
      searchTerms.forEach(term => {
        const contentMatches = (fileContentLower.match(new RegExp(term, 'g')) || []).length;
        if (contentMatches > 0) {
          score += contentMatches * 10;
          console.log(`   - Found '${term}' ${contentMatches} times in content (+${contentMatches * 10})`);
        }
        
        if (file.name.toLowerCase().includes(term)) {
          score += 20;
          console.log(`   - Found '${term}' in filename (+20)`);
        }
      });
      
      // Boost score for relevant content
      if (prompt.includes('signin') || prompt.includes('login') || prompt.includes('sign in')) {
        if (file.hasSignin) {
          score += 50;
          console.log(`   - Has signin content (+50)`);
        }
        if (file.hasButtons) {
          score += 25;
          console.log(`   - Has buttons (+25)`);
        }
      }
      
      if (prompt.includes('button')) {
        if (file.hasButtons) {
          score += 40;
          console.log(`   - Has buttons for button request (+40)`);
        }
      }
      
      // Boost main files
      if (file.isMainFile) {
        score += 10;
        console.log(`   - Is main file (+10)`);
      }
      
      console.log(`   - Total score: ${score}`);
      
      if (score > 0) {
        matches.push({ file, score });
      }
    }
    
    if (matches.length > 0) {
      // Sort by score and take top matches
      matches.sort((a, b) => b.score - a.score);
      const topMatches = matches.slice(0, 3); // Take top 3 files
      
      const files = topMatches.map(m => m.file.relativePath);
      console.log(`\n✅ Fallback found ${files.length} matching files:`);
      files.forEach(f => console.log(`   - ${f}`));
      
      // Determine scope based on prompt
      const scope = this.determineScope(prompt);
      console.log(`🎯 Determined scope: ${scope}`);
      
      return { files, scope };
    }
    
    console.log('❌ No matching files found in fallback search');
    return { files: [], scope: 'TARGETED_NODES' };
  }

  // Determine scope based on prompt
  private determineScope(prompt: string): 'FULL_FILE' | 'TARGETED_NODES' {
    const fullFileKeywords = [
      'dark mode', 'theme', 'layout', 'design', 'style', 'ui',
      'redesign', 'rework', 'complete', 'entire', 'all',
      'comprehensive', 'overhaul', 'modernize'
    ];
    
    const isFullFileScope = fullFileKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    
    return isFullFileScope ? 'FULL_FILE' : 'TARGETED_NODES';
  }

  // STEP 3: Handle full file modification
  private async handleFullFileModification(prompt: string, filePath: string): Promise<boolean> {
    console.log(`🔄 FULL_FILE modification for ${filePath}...`);
    
    const file = this.projectFiles.get(filePath);
    if (!file) {
      console.error(`File not found: ${filePath}`);
      return false;
    }

    const claudePrompt = `
**User Request:** "${prompt}"

**Current File Content:**
\`\`\`jsx
${file.content}
\`\`\`

**Task:** Rewrite the entire file according to the request. Preserve functionality but apply comprehensive changes.

**Response:** Return only the complete modified file:
\`\`\`jsx
[complete file content here]
\`\`\`
    `.trim();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        temperature: 0,
        messages: [{ role: 'user', content: claudePrompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock?.type === 'text') {
        const text = firstBlock.text;
        const codeMatch = text.match(/```jsx\n([\s\S]*?)```/) || text.match(/```tsx\n([\s\S]*?)```/);
        
        if (codeMatch) {
          const modifiedContent = codeMatch[1].trim();
          await fs.writeFile(file.path, modifiedContent, 'utf8');
          console.log(`💾 Saved full file modification: ${filePath}`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error in full file modification for ${filePath}:`, error);
      return false;
    }
  }
  private extractComponentName(content: string): string | null {
    const match = content.match(/(?:function|const|class)\s+(\w+)/) || 
                  content.match(/export\s+default\s+(\w+)/);
    return match ? match[1] : null;
  }

  private checkForButtons(content: string): boolean {
    return /button|Button|btn|<button|type.*submit/i.test(content);
  }

  private checkForSignin(content: string): boolean {
    return /signin|sign.?in|login|log.?in|auth/i.test(content);
  }

  private isMainFile(filePath: string, content: string): boolean {
    const fileName = basename(filePath).toLowerCase();
    const isMainName = /^(app|index|main|home)\./.test(fileName);
    const hasMainContent = /export\s+default|function\s+App|class\s+App/i.test(content);
    return isMainName || hasMainContent;
  }

  // Build project summary for Claude
  private buildProjectSummary(): string {
    let summary = "**PROJECT FILE TREE + METADATA:**\n\n";
    
    const sortedFiles = Array.from(this.projectFiles.values())
      .sort((a, b) => {
        if (a.isMainFile && !b.isMainFile) return -1;
        if (!a.isMainFile && b.isMainFile) return 1;
        if (a.hasSignin && !b.hasSignin) return -1;
        if (!a.hasSignin && b.hasSignin) return 1;
        return a.relativePath.localeCompare(b.relativePath);
      });

    sortedFiles.forEach(file => {
      summary += `**${file.relativePath}**\n`;
      summary += `- Size: ${file.size} bytes, ${file.lines} lines\n`;
      summary += `- Component: ${file.componentName || 'Unknown'}\n`;
      summary += `- Has buttons: ${file.hasButtons ? 'Yes' : 'No'}\n`;
      summary += `- Has signin: ${file.hasSignin ? 'Yes' : 'No'}\n`;
      summary += `- Is main file: ${file.isMainFile ? 'Yes' : 'No'}\n`;
      summary += `- Code preview:\n\`\`\`\n${file.snippet}\n\`\`\`\n\n`;
    });

    return summary;
  }

  // STEP 2: Claude analyzes project tree to determine relevant files AND scope
  private async identifyRelevantFiles(prompt: string): Promise<{ files: string[]; scope: 'FULL_FILE' | 'TARGETED_NODES' }> {
    console.log(`🤖 STEP 2: Claude analyzing project tree AND determining scope for: "${prompt}"`);
    
    const projectSummary = this.buildProjectSummary();
    
    const claudePrompt = `
You are analyzing a React project to determine which files need modification AND the scope of changes.

**User Request:** "${prompt}"

${projectSummary}

**Your Task:** 
1. Determine which file(s) are relevant for this modification request
2. **CRITICALLY IMPORTANT**: Determine the modification scope based on the request

**Scope Guidelines (VERY IMPORTANT):**
- **FULL_FILE**: Use when request involves:
  * Dark mode, theme changes, color scheme overhauls
  * Layout changes, design changes, comprehensive styling
  * Complete redesigns, modernization, overhauls
  * Adding responsive design, mobile layouts
  * Structural changes affecting entire components
  * Any request mentioning "entire", "all", "complete", "comprehensive"

- **TARGETED_NODES**: Use when request involves:
  * Specific button colors (e.g., "make signin button red")
  * Individual text changes
  * Single element modifications
  * Small styling tweaks to specific elements
  * Adding/removing specific attributes

**File Selection Guidelines:**
- For signin/login requests: Look for files with signin content
- For button styling: Look for files with buttons  
- For layout/theme changes: Focus on main app files
- You can select multiple files if the change affects multiple components
- NEVER select files from components/ui/ folder (these are UI library components)

**Examples:**
- "make signin button red" → TARGETED_NODES
- "add dark mode theme" → FULL_FILE
- "change layout to modern design" → FULL_FILE
- "make header responsive" → FULL_FILE
- "change text color of welcome message" → TARGETED_NODES

**Response Format:** Return ONLY this JSON:
\`\`\`json
{
  "files": ["src/App.tsx", "src/components/LoginForm.tsx"],
  "scope": "FULL_FILE"
}
\`\`\`

**CRITICAL**: Pay special attention to scope determination - this controls the entire workflow!

Return ONLY the JSON, no explanations.
    `.trim();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 400,
        temperature: 0,
        messages: [{ role: 'user', content: claudePrompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock?.type === 'text') {
        const text = firstBlock.text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
        
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[1]);
          console.log(`🎯 Claude selected files: ${result.files.join(', ')}`);
          console.log(`📋 Claude determined scope: ${result.scope}`);
          
          // Log reasoning for scope decision
          if (result.scope === 'FULL_FILE') {
            console.log(`🔄 FULL_FILE approach: Will send complete file content to Claude for comprehensive modification`);
          } else {
            console.log(`🎯 TARGETED_NODES approach: Will use AST to find specific elements to modify`);
          }
          
          return result;
        }
      }
      
      return { files: [], scope: 'TARGETED_NODES' };
    } catch (error) {
      console.error('Error in file identification:', error);
      return { files: [], scope: 'TARGETED_NODES' };
    }
  }

  // STEP 3: Parse selected files with AST to produce detailed trees
  private parseFileWithAST(filePath: string): ASTNode[] {
    console.log(`🔧 STEP 3: Parsing ${filePath} with AST...`);
    
    const file = this.projectFiles.get(filePath);
    if (!file) {
      console.error(`File not found: ${filePath}`);
      return [];
    }

    try {
      const ast = parse(file.content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const nodes: ASTNode[] = [];
      let nodeId = 1;
      const lines = file.content.split('\n');

      traverse(ast, {
        JSXElement(path: any) {
          const node = path.node;
          
          let tagName = 'unknown';
          if (node.openingElement.name.type === 'JSXIdentifier') {
            tagName = node.openingElement.name.name;
          }
          
          let textContent = '';
          if (node.children) {
            node.children.forEach((child: any) => {
              if (child.type === 'JSXText') {
                textContent += child.value.trim() + ' ';
              }
            });
          }

          const startLine = node.loc?.start.line || 1;
          const endLine = node.loc?.end.line || 1;
          const startColumn = node.loc?.start.column || 0;
          const endColumn = node.loc?.end.column || 0;
          
          // Extract exact code snippet
          const codeSnippet = lines.slice(startLine - 1, endLine).join('\n');
          
          // Get fuller context (3 lines before and after)
          const contextStart = Math.max(0, startLine - 4);
          const contextEnd = Math.min(lines.length, endLine + 3);
          const fullContext = lines.slice(contextStart, contextEnd).join('\n');

          // Get attributes
          const attributes: string[] = [];
          if (node.openingElement.attributes) {
            node.openingElement.attributes.forEach((attr: any) => {
              if (attr.type === 'JSXAttribute' && attr.name) {
                attributes.push(attr.name.name);
              }
            });
          }

          nodes.push({
            id: `node_${nodeId++}`,
            type: 'JSXElement',
            tagName,
            textContent: textContent.trim(),
            startLine,
            endLine,
            startColumn,
            endColumn,
            codeSnippet,
            fullContext,
            isButton: tagName.toLowerCase().includes('button'),
            hasSigninText: /sign\s*in|log\s*in|login|signin/i.test(textContent),
            attributes
          });
        }
      });

      console.log(`📊 Found ${nodes.length} AST nodes in ${filePath}`);
      return nodes;
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return [];
    }
  }

  // STEP 4: Claude pinpoints exact AST nodes needing modification
  private async identifyTargetNodes(prompt: string, filePath: string, nodes: ASTNode[]): Promise<ASTNode[]> {
    console.log(`🎯 STEP 4: Claude identifying target nodes in ${filePath}...`);

    const nodesPreview = nodes.map(node => 
      `**${node.id}:** <${node.tagName}> "${node.textContent}" (lines ${node.startLine}-${node.endLine})${node.isButton ? ' [BUTTON]' : ''}${node.hasSigninText ? ' [SIGNIN]' : ''}`
    ).join('\n');

    const claudePrompt = `
**User Request:** "${prompt}"
**File:** ${filePath}

**Available AST Nodes:**
${nodesPreview}

**Task:** Identify which specific AST nodes need modification for this request.

**Guidelines:**
- For "make signin button red": Look for button nodes with signin text
- For styling changes: Find the specific elements that need styling
- Be precise - only select nodes that actually need to change

**Response Format:** Return ONLY a JSON array of node IDs:
\`\`\`json
["node_5", "node_12"]
\`\`\`

If no nodes need changes, return: []
    `.trim();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 200,
        temperature: 0,
        messages: [{ role: 'user', content: claudePrompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock?.type === 'text') {
        const text = firstBlock.text;
        const match = text.match(/\[(.*?)\]/);
        
        if (match) {
          const nodeIds = JSON.parse(`[${match[1]}]`);
          const targetNodes = nodes.filter(node => nodeIds.includes(node.id));
          console.log(`🎯 Claude selected ${targetNodes.length} target nodes: ${nodeIds.join(', ')}`);
          return targetNodes;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error identifying target nodes:', error);
      return [];
    }
  }

  // STEP 5-6: Extract code snippets and send to Claude for modification
  private async modifyCodeSnippets(prompt: string, targetNodes: ASTNode[]): Promise<Map<string, string>> {
    console.log(`✏️ STEP 6: Claude modifying ${targetNodes.length} code snippets...`);

    const snippetsInfo = targetNodes.map(node => 
      `**${node.id}:** (lines ${node.startLine}-${node.endLine})
\`\`\`jsx
${node.codeSnippet}
\`\`\`

Context:
\`\`\`jsx
${node.fullContext}
\`\`\`
`).join('\n\n');

    const claudePrompt = `
**User Request:** "${prompt}"

**Code Snippets to Modify:**
${snippetsInfo}

**Task:** Modify each code snippet according to the request. Return the exact replacement code.

**Response Format:** JSON object with node ID as key and modified code as value:
\`\`\`json
{
  "node_5": "<modified JSX code here>",
  "node_12": "<modified JSX code here>"
}
\`\`\`
    `.trim();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2000,
        temperature: 0,
        messages: [{ role: 'user', content: claudePrompt }],
      });

      const firstBlock = response.content[0];
      if (firstBlock?.type === 'text') {
        const text = firstBlock.text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
        
        if (jsonMatch) {
          const modifications = JSON.parse(jsonMatch[1]);
          const modMap = new Map<string, string>();
          
          for (const [nodeId, modifiedCode] of Object.entries(modifications)) {
            modMap.set(nodeId, modifiedCode as string);
          }
          
          console.log(`✅ Received ${modMap.size} code modifications`);
          return modMap;
        }
      }
      
      return new Map();
    } catch (error) {
      console.error('Error modifying code snippets:', error);
      return new Map();
    }
  }

  // STEP 7-8: Replace exact code ranges with modified snippets
  private async applyModifications(filePath: string, targetNodes: ASTNode[], modifications: Map<string, string>): Promise<boolean> {
    console.log(`🔄 STEP 8: Applying modifications to ${filePath}...`);
    
    const file = this.projectFiles.get(filePath);
    if (!file) {
      console.error(`File not found: ${filePath}`);
      return false;
    }

    let modifiedContent = file.content;
    const lines = modifiedContent.split('\n');
    
    // Sort nodes by line number (descending) to avoid index shifts
    const sortedNodes = targetNodes
      .filter(node => modifications.has(node.id))
      .sort((a, b) => b.startLine - a.startLine);
    
    for (const node of sortedNodes) {
      const modifiedCode = modifications.get(node.id);
      if (modifiedCode) {
        const startIndex = node.startLine - 1;
        const endIndex = node.endLine - 1;
        const newLines = modifiedCode.split('\n');
        
        lines.splice(startIndex, endIndex - startIndex + 1, ...newLines);
        console.log(`  ✅ Replaced ${node.id} (lines ${node.startLine}-${node.endLine})`);
      }
    }
    
    modifiedContent = lines.join('\n');
    
    try {
      await fs.writeFile(file.path, modifiedContent, 'utf8');
      console.log(`💾 Saved modified file: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to save ${filePath}:`, error);
      return false;
    }
  }

  // Main workflow following your exact 8-step process
  async processModification(prompt: string): Promise<ModificationResult> {
    try {
      console.log(`🚀 Starting 8-step modification workflow for: "${prompt}"`);
      
      // STEP 1: Build project file tree + metadata
      await this.buildProjectTree();
      
      if (this.projectFiles.size === 0) {
        return { success: false, error: 'No React files found in project' };
      }

      // STEP 2: Claude analyzes project tree to determine relevant files + scope
      let fileAnalysis = await this.identifyRelevantFiles(prompt);
      
      // FALLBACK: If no files identified, search all files one by one
      if (fileAnalysis.files.length === 0) {
        console.log(`⚠️ No files identified by Claude, triggering fallback search...`);
        fileAnalysis = await this.fallbackFileSearch(prompt);
      }
      
      if (fileAnalysis.files.length === 0) {
        return { success: false, error: 'No relevant files found even after fallback search' };
      }

      const { files: relevantFiles, scope } = fileAnalysis;
      console.log(`📋 Processing ${relevantFiles.length} files with ${scope} approach`);

      // Handle based on scope
      if (scope === 'FULL_FILE') {
        console.log(`🔄 Using FULL_FILE approach for comprehensive changes...`);
        
        let successCount = 0;
        for (const filePath of relevantFiles) {
          const success = await this.handleFullFileModification(prompt, filePath);
          if (success) successCount++;
        }
        
        if (successCount > 0) {
          return {
            success: true,
            selectedFiles: relevantFiles,
            approach: 'FULL_FILE',
            modifiedRanges: [{
              file: relevantFiles.join(', '),
              range: {
                startLine: 1,
                endLine: 9999,
                startColumn: 0,
                endColumn: 0,
                originalCode: 'Full file rewrite'
              },
              modifiedCode: 'Complete file modification'
            }]
          };
        } else {
          return { success: false, error: 'Full file modifications failed' };
        }
      } else {
        // TARGETED_NODES approach - continue with AST workflow
        console.log(`🎯 Using TARGETED_NODES approach for precise changes...`);
        
        const modifiedRanges: Array<{
          file: string;
          range: CodeRange;
          modifiedCode: string;
        }> = [];

        // Process each relevant file with AST
        for (const filePath of relevantFiles) {
          console.log(`\n🔄 Processing file: ${filePath}`);
          
          // STEP 3: Parse file with AST to produce detailed trees
          const astNodes = this.parseFileWithAST(filePath);
          
          if (astNodes.length === 0) {
            console.log(`⚠️ No AST nodes found in ${filePath}`);
            continue;
          }

          // STEP 4: Claude pinpoints exact AST nodes needing modification
          const targetNodes = await this.identifyTargetNodes(prompt, filePath, astNodes);
          
          if (targetNodes.length === 0) {
            console.log(`⚠️ No target nodes identified in ${filePath}`);
            continue;
          }

          // STEP 5-6: Extract code snippets and send to Claude for modification
          const modifications = await this.modifyCodeSnippets(prompt, targetNodes);
          
          if (modifications.size === 0) {
            console.log(`⚠️ No modifications received for ${filePath}`);
            continue;
          }

          // STEP 7-8: Replace exact code ranges with modified snippets
          const success = await this.applyModifications(filePath, targetNodes, modifications);
          
          if (success) {
            // Record the modifications
            for (const node of targetNodes) {
              if (modifications.has(node.id)) {
                modifiedRanges.push({
                  file: filePath,
                  range: {
                    startLine: node.startLine,
                    endLine: node.endLine,
                    startColumn: node.startColumn,
                    endColumn: node.endColumn,
                    originalCode: node.codeSnippet
                  },
                  modifiedCode: modifications.get(node.id)!
                });
              }
            }
          }
        }

        if (modifiedRanges.length > 0) {
          console.log(`\n🎉 Successfully completed 8-step workflow!`);
          console.log(`📊 Modified ${modifiedRanges.length} code ranges across ${relevantFiles.length} files`);
          
          return {
            success: true,
            selectedFiles: relevantFiles,
            approach: 'TARGETED_NODES',
            modifiedRanges
          };
        } else {
          return { success: false, error: 'No AST modifications were successfully applied' };
        }
      }
      
    } catch (error) {
      console.error('Error in modification workflow:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}