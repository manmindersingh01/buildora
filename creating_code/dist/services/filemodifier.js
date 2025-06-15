"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentFileModifier = void 0;
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const fs_1 = require("fs");
const path_1 = require("path");
class IntelligentFileModifier {
    constructor(anthropic, reactBasePath) {
        this.anthropic = anthropic;
        this.reactBasePath = reactBasePath;
        this.projectFiles = new Map();
    }
    // STEP 1: Build project file tree + metadata
    buildProjectTree() {
        return __awaiter(this, void 0, void 0, function* () {
            const srcPath = (0, path_1.join)(this.reactBasePath, 'src');
            try {
                yield fs_1.promises.access(srcPath);
                console.log(`📁 Building project tree from: ${srcPath}`);
            }
            catch (error) {
                console.error(`❌ src directory not found: ${srcPath}`);
                return;
            }
            const scanDir = (dir_1, ...args_1) => __awaiter(this, [dir_1, ...args_1], void 0, function* (dir, relativePath = '') {
                try {
                    const entries = yield fs_1.promises.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const fullPath = (0, path_1.join)(dir, entry.name);
                        const relPath = relativePath ? (0, path_1.join)(relativePath, entry.name) : entry.name;
                        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                            yield scanDir(fullPath, relPath);
                        }
                        else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
                            yield this.analyzeFile(fullPath, relPath);
                        }
                    }
                }
                catch (error) {
                    console.error(`❌ Error scanning directory ${dir}:`, error);
                }
            });
            yield scanDir(srcPath);
            console.log(`✅ Project tree built. Found ${this.projectFiles.size} React files.`);
        });
    }
    // Analyze individual file for metadata
    analyzeFile(filePath, relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Skip UI components folder
                if (relativePath.includes('components/ui/') || relativePath.includes('components\\ui\\')) {
                    console.log(`⏭️ Skipping UI component: ${relativePath}`);
                    return;
                }
                const content = yield fs_1.promises.readFile(filePath, 'utf8');
                const stats = yield fs_1.promises.stat(filePath);
                const lines = content.split('\n');
                const projectFile = {
                    name: (0, path_1.basename)(filePath),
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
            }
            catch (error) {
                console.error(`Failed to analyze file ${relativePath}:`, error);
            }
        });
    }
    // Fallback: Go through all files one by one to find relevant content
    fallbackFileSearch(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🔍 FALLBACK: No files identified by Claude, searching all files one by one...`);
            console.log(`📁 Searching through ${this.projectFiles.size} files for: "${prompt}"`);
            if (this.projectFiles.size === 0) {
                console.log('❌ No files to search through');
                return { files: [], scope: 'TARGETED_NODES' };
            }
            const searchTerms = prompt.toLowerCase().split(' ');
            const matches = [];
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
        });
    }
    // Determine scope based on prompt
    determineScope(prompt) {
        const fullFileKeywords = [
            'dark mode', 'theme', 'layout', 'design', 'style', 'ui',
            'redesign', 'rework', 'complete', 'entire', 'all',
            'comprehensive', 'overhaul', 'modernize'
        ];
        const isFullFileScope = fullFileKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
        return isFullFileScope ? 'FULL_FILE' : 'TARGETED_NODES';
    }
    // STEP 3: Handle full file modification
    handleFullFileModification(prompt, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield this.anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 4000,
                    temperature: 0,
                    messages: [{ role: 'user', content: claudePrompt }],
                });
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const codeMatch = text.match(/```jsx\n([\s\S]*?)```/) || text.match(/```tsx\n([\s\S]*?)```/);
                    if (codeMatch) {
                        const modifiedContent = codeMatch[1].trim();
                        yield fs_1.promises.writeFile(file.path, modifiedContent, 'utf8');
                        console.log(`💾 Saved full file modification: ${filePath}`);
                        return true;
                    }
                }
                return false;
            }
            catch (error) {
                console.error(`Error in full file modification for ${filePath}:`, error);
                return false;
            }
        });
    }
    extractComponentName(content) {
        const match = content.match(/(?:function|const|class)\s+(\w+)/) ||
            content.match(/export\s+default\s+(\w+)/);
        return match ? match[1] : null;
    }
    checkForButtons(content) {
        return /button|Button|btn|<button|type.*submit/i.test(content);
    }
    checkForSignin(content) {
        return /signin|sign.?in|login|log.?in|auth/i.test(content);
    }
    isMainFile(filePath, content) {
        const fileName = (0, path_1.basename)(filePath).toLowerCase();
        const isMainName = /^(app|index|main|home)\./.test(fileName);
        const hasMainContent = /export\s+default|function\s+App|class\s+App/i.test(content);
        return isMainName || hasMainContent;
    }
    // Build project summary for Claude
    buildProjectSummary() {
        let summary = "**PROJECT FILE TREE + METADATA:**\n\n";
        const sortedFiles = Array.from(this.projectFiles.values())
            .sort((a, b) => {
            if (a.isMainFile && !b.isMainFile)
                return -1;
            if (!a.isMainFile && b.isMainFile)
                return 1;
            if (a.hasSignin && !b.hasSignin)
                return -1;
            if (!a.hasSignin && b.hasSignin)
                return 1;
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
    identifyRelevantFiles(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield this.anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 400,
                    temperature: 0,
                    messages: [{ role: 'user', content: claudePrompt }],
                });
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                        const result = JSON.parse(jsonMatch[1]);
                        console.log(`🎯 Claude selected files: ${result.files.join(', ')}`);
                        console.log(`📋 Claude determined scope: ${result.scope}`);
                        // Log reasoning for scope decision
                        if (result.scope === 'FULL_FILE') {
                            console.log(`🔄 FULL_FILE approach: Will send complete file content to Claude for comprehensive modification`);
                        }
                        else {
                            console.log(`🎯 TARGETED_NODES approach: Will use AST to find specific elements to modify`);
                        }
                        return result;
                    }
                }
                return { files: [], scope: 'TARGETED_NODES' };
            }
            catch (error) {
                console.error('Error in file identification:', error);
                return { files: [], scope: 'TARGETED_NODES' };
            }
        });
    }
    // STEP 3: Parse selected files with AST to produce detailed trees
    parseFileWithAST(filePath) {
        console.log(`🔧 STEP 3: Parsing ${filePath} with AST...`);
        const file = this.projectFiles.get(filePath);
        if (!file) {
            console.error(`File not found: ${filePath}`);
            return [];
        }
        try {
            const ast = (0, parser_1.parse)(file.content, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
            });
            const nodes = [];
            let nodeId = 1;
            const lines = file.content.split('\n');
            (0, traverse_1.default)(ast, {
                JSXElement(path) {
                    var _a, _b, _c, _d;
                    const node = path.node;
                    let tagName = 'unknown';
                    if (node.openingElement.name.type === 'JSXIdentifier') {
                        tagName = node.openingElement.name.name;
                    }
                    let textContent = '';
                    if (node.children) {
                        node.children.forEach((child) => {
                            if (child.type === 'JSXText') {
                                textContent += child.value.trim() + ' ';
                            }
                        });
                    }
                    const startLine = ((_a = node.loc) === null || _a === void 0 ? void 0 : _a.start.line) || 1;
                    const endLine = ((_b = node.loc) === null || _b === void 0 ? void 0 : _b.end.line) || 1;
                    const startColumn = ((_c = node.loc) === null || _c === void 0 ? void 0 : _c.start.column) || 0;
                    const endColumn = ((_d = node.loc) === null || _d === void 0 ? void 0 : _d.end.column) || 0;
                    // Extract exact code snippet
                    const codeSnippet = lines.slice(startLine - 1, endLine).join('\n');
                    // Get fuller context (3 lines before and after)
                    const contextStart = Math.max(0, startLine - 4);
                    const contextEnd = Math.min(lines.length, endLine + 3);
                    const fullContext = lines.slice(contextStart, contextEnd).join('\n');
                    // Get attributes
                    const attributes = [];
                    if (node.openingElement.attributes) {
                        node.openingElement.attributes.forEach((attr) => {
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
        }
        catch (error) {
            console.error(`Error parsing ${filePath}:`, error);
            return [];
        }
    }
    // STEP 4: Claude pinpoints exact AST nodes needing modification
    identifyTargetNodes(prompt, filePath, nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🎯 STEP 4: Claude identifying target nodes in ${filePath}...`);
            const nodesPreview = nodes.map(node => `**${node.id}:** <${node.tagName}> "${node.textContent}" (lines ${node.startLine}-${node.endLine})${node.isButton ? ' [BUTTON]' : ''}${node.hasSigninText ? ' [SIGNIN]' : ''}`).join('\n');
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
                const response = yield this.anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 200,
                    temperature: 0,
                    messages: [{ role: 'user', content: claudePrompt }],
                });
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
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
            }
            catch (error) {
                console.error('Error identifying target nodes:', error);
                return [];
            }
        });
    }
    // STEP 5-6: Extract code snippets and send to Claude for modification
    modifyCodeSnippets(prompt, targetNodes) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`✏️ STEP 6: Claude modifying ${targetNodes.length} code snippets...`);
            const snippetsInfo = targetNodes.map(node => `**${node.id}:** (lines ${node.startLine}-${node.endLine})
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
                const response = yield this.anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 2000,
                    temperature: 0,
                    messages: [{ role: 'user', content: claudePrompt }],
                });
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                        const modifications = JSON.parse(jsonMatch[1]);
                        const modMap = new Map();
                        for (const [nodeId, modifiedCode] of Object.entries(modifications)) {
                            modMap.set(nodeId, modifiedCode);
                        }
                        console.log(`✅ Received ${modMap.size} code modifications`);
                        return modMap;
                    }
                }
                return new Map();
            }
            catch (error) {
                console.error('Error modifying code snippets:', error);
                return new Map();
            }
        });
    }
    // STEP 7-8: Replace exact code ranges with modified snippets
    applyModifications(filePath, targetNodes, modifications) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield fs_1.promises.writeFile(file.path, modifiedContent, 'utf8');
                console.log(`💾 Saved modified file: ${filePath}`);
                return true;
            }
            catch (error) {
                console.error(`Failed to save ${filePath}:`, error);
                return false;
            }
        });
    }
    // Main workflow following your exact 8-step process
    processModification(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`🚀 Starting 8-step modification workflow for: "${prompt}"`);
                // STEP 1: Build project file tree + metadata
                yield this.buildProjectTree();
                if (this.projectFiles.size === 0) {
                    return { success: false, error: 'No React files found in project' };
                }
                // STEP 2: Claude analyzes project tree to determine relevant files + scope
                let fileAnalysis = yield this.identifyRelevantFiles(prompt);
                // FALLBACK: If no files identified, search all files one by one
                if (fileAnalysis.files.length === 0) {
                    console.log(`⚠️ No files identified by Claude, triggering fallback search...`);
                    fileAnalysis = yield this.fallbackFileSearch(prompt);
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
                        const success = yield this.handleFullFileModification(prompt, filePath);
                        if (success)
                            successCount++;
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
                    }
                    else {
                        return { success: false, error: 'Full file modifications failed' };
                    }
                }
                else {
                    // TARGETED_NODES approach - continue with AST workflow
                    console.log(`🎯 Using TARGETED_NODES approach for precise changes...`);
                    const modifiedRanges = [];
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
                        const targetNodes = yield this.identifyTargetNodes(prompt, filePath, astNodes);
                        if (targetNodes.length === 0) {
                            console.log(`⚠️ No target nodes identified in ${filePath}`);
                            continue;
                        }
                        // STEP 5-6: Extract code snippets and send to Claude for modification
                        const modifications = yield this.modifyCodeSnippets(prompt, targetNodes);
                        if (modifications.size === 0) {
                            console.log(`⚠️ No modifications received for ${filePath}`);
                            continue;
                        }
                        // STEP 7-8: Replace exact code ranges with modified snippets
                        const success = yield this.applyModifications(filePath, targetNodes, modifications);
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
                                        modifiedCode: modifications.get(node.id)
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
                    }
                    else {
                        return { success: false, error: 'No AST modifications were successfully applied' };
                    }
                }
            }
            catch (error) {
                console.error('Error in modification workflow:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
}
exports.IntelligentFileModifier = IntelligentFileModifier;
//# sourceMappingURL=filemodifier.js.map