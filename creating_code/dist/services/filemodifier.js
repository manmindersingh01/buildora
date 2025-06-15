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
            }
            catch (error) {
                console.log('No src directory found');
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
                    console.log(`Error scanning directory ${dir}:`, error);
                }
            });
            yield scanDir(srcPath);
        });
    }
    // Analyze individual file for metadata
    analyzeFile(filePath, relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Skip UI components folder
                if (relativePath.includes('components/ui/') || relativePath.includes('components\\ui\\')) {
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
            }
            catch (error) {
                console.log(`Error analyzing file ${filePath}:`, error);
            }
        });
    }
    // Fallback: Go through all files one by one to find relevant content
    fallbackFileSearch(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.projectFiles.size === 0) {
                return { files: [], scope: 'TARGETED_NODES' };
            }
            const searchTerms = prompt.toLowerCase().split(' ');
            const matches = [];
            for (const [relativePath, file] of this.projectFiles.entries()) {
                let score = 0;
                const fileContentLower = file.content.toLowerCase();
                // Score based on prompt keywords
                function escapeRegExp(string) {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                searchTerms.forEach(term => {
                    const contentMatches = (fileContentLower.match(new RegExp(escapeRegExp(term), 'g')) || []).length;
                    if (contentMatches > 0) {
                        score += contentMatches * 10;
                    }
                    if (file.name.toLowerCase().includes(term)) {
                        score += 20;
                    }
                });
                // Boost score for relevant content
                if (prompt.includes('signin') || prompt.includes('login') || prompt.includes('sign in')) {
                    if (file.hasSignin)
                        score += 50;
                    if (file.hasButtons)
                        score += 25;
                }
                if (prompt.includes('button')) {
                    if (file.hasButtons)
                        score += 40;
                }
                // Boost main files
                if (file.isMainFile)
                    score += 10;
                if (score > 0) {
                    matches.push({ file, score });
                }
            }
            if (matches.length > 0) {
                matches.sort((a, b) => b.score - a.score);
                const topMatches = matches.slice(0, 3);
                const files = topMatches.map(m => m.file.relativePath);
                const scope = this.determineScope(prompt);
                return { files, scope };
            }
            return { files: [], scope: 'TARGETED_NODES' };
        });
    }
    // Determine scope based on prompt - FIXED to prefer TARGETED_NODES
    determineScope(prompt) {
        const promptLower = prompt.toLowerCase();
        // TARGETED_NODES keywords (specific changes)
        const targetedKeywords = [
            'button', 'color', 'text', 'size', 'font', 'border', 'padding', 'margin',
            'background', 'hover', 'click', 'style', 'class', 'attribute',
            'red', 'blue', 'green', 'yellow', 'white', 'black', 'gray',
            'make', 'change', 'update', 'modify', 'fix', 'add', 'remove'
        ];
        // FULL_FILE keywords (comprehensive changes)
        const fullFileKeywords = [
            'dark mode', 'theme', 'layout', 'design overhaul', 'redesign',
            'rework', 'complete', 'entire', 'all', 'comprehensive', 'overhaul',
            'modernize', 'responsive', 'mobile layout', 'structure'
        ];
        // Check for full file keywords first
        const hasFullFileKeywords = fullFileKeywords.some(keyword => promptLower.includes(keyword));
        if (hasFullFileKeywords) {
            return 'FULL_FILE';
        }
        // Default to TARGETED_NODES for specific changes
        return 'TARGETED_NODES';
    }
    // STEP 3: Handle full file modification
    handleFullFileModification(prompt, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.projectFiles.get(filePath);
            if (!file) {
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
                // FIXED: Better error handling for response
                if (!response.content || response.content.length === 0) {
                    console.log('No response content received from Claude');
                    return false;
                }
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const codeMatch = text.match(/```jsx\n([\s\S]*?)```/) || text.match(/```tsx\n([\s\S]*?)```/);
                    if (codeMatch) {
                        const modifiedContent = codeMatch[1].trim();
                        yield fs_1.promises.writeFile(file.path, modifiedContent, 'utf8');
                        return true;
                    }
                }
                return false;
            }
            catch (error) {
                console.log('Error in handleFullFileModification:', error);
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
            summary += `- Component: ${file.componentName || 'Unknown'}\n`;
            summary += `- Has buttons: ${file.hasButtons ? 'Yes' : 'No'}\n`;
            summary += `- Has signin: ${file.hasSignin ? 'Yes' : 'No'}\n`;
            summary += `- Code preview:\n\`\`\`\n${file.snippet}\n\`\`\`\n\n`;
        });
        return summary;
    }
    // STEP 2: Claude analyzes project tree to determine relevant files AND scope
    identifyRelevantFiles(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectSummary = this.buildProjectSummary();
            const claudePrompt = `
You are analyzing a React project to determine which files need modification AND the scope of changes.

**User Request:** "${prompt}"

${projectSummary}

**Your Task:** 
1. Determine which file(s) are relevant for this modification request
2. **CRITICALLY IMPORTANT**: Determine the modification scope based on the request

**Scope Guidelines (VERY IMPORTANT):**
- **TARGETED_NODES**: Use for MOST requests involving:
  * Specific element changes (button colors, text changes, styling)
  * Individual component modifications
  * Adding/removing specific attributes
  * Color changes, size changes, font changes
  * Hover effects, click handlers
  * ANY specific element styling or behavior

- **FULL_FILE**: Use ONLY when request involves:
  * Complete redesigns, overhauls, or "rework entire file"
  * Adding comprehensive features like dark mode themes
  * Structural layout changes affecting entire components
  * Converting entire components to different frameworks
  * Requests explicitly mentioning "entire", "complete", "comprehensive"

**Examples:**
- "make signin button red" → TARGETED_NODES
- "change button color to blue" → TARGETED_NODES  
- "add hover effect to button" → TARGETED_NODES
- "change text color" → TARGETED_NODES
- "add dark mode theme" → FULL_FILE
- "redesign entire component" → FULL_FILE

**Response Format:** Return ONLY this JSON:
\`\`\`json
{
  "files": ["src/App.tsx"],
  "scope": "TARGETED_NODES"
}
\`\`\`

**DEFAULT TO TARGETED_NODES** unless clearly a full file change is needed.
    `.trim();
            try {
                const response = yield this.anthropic.messages.create({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 400,
                    temperature: 0,
                    messages: [{ role: 'user', content: claudePrompt }],
                });
                // FIXED: Better error handling for response
                if (!response.content || response.content.length === 0) {
                    console.log('No response content received from Claude for file identification');
                    return { files: [], scope: 'TARGETED_NODES' };
                }
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                        try {
                            const result = JSON.parse(jsonMatch[1]);
                            return result;
                        }
                        catch (parseError) {
                            console.log('Error parsing JSON response:', parseError);
                            console.log('Raw response:', text);
                            return { files: [], scope: 'TARGETED_NODES' };
                        }
                    }
                }
                return { files: [], scope: 'TARGETED_NODES' };
            }
            catch (error) {
                console.log('Error in identifyRelevantFiles:', error);
                return { files: [], scope: 'TARGETED_NODES' };
            }
        });
    }
    // STEP 3: Parse selected files with AST to produce detailed trees
    parseFileWithAST(filePath) {
        const file = this.projectFiles.get(filePath);
        if (!file) {
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
            return nodes;
        }
        catch (error) {
            console.log(`Error parsing AST for ${filePath}:`, error);
            return [];
        }
    }
    // STEP 4: Claude pinpoints exact AST nodes needing modification
    identifyTargetNodes(prompt, filePath, nodes) {
        return __awaiter(this, void 0, void 0, function* () {
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
                // FIXED: Better error handling for response
                if (!response.content || response.content.length === 0) {
                    console.log('No response content received from Claude for node identification');
                    return [];
                }
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    // FIXED: Better JSON parsing
                    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                        try {
                            const nodeIds = JSON.parse(jsonMatch[1]);
                            const targetNodes = nodes.filter(node => nodeIds.includes(node.id));
                            return targetNodes;
                        }
                        catch (parseError) {
                            console.log('Error parsing node IDs:', parseError);
                            console.log('Raw response:', text);
                            return [];
                        }
                    }
                    else {
                        // Try to extract array from response text
                        const arrayMatch = text.match(/\[(.*?)\]/);
                        if (arrayMatch) {
                            try {
                                const nodeIds = JSON.parse(`[${arrayMatch[1]}]`);
                                const targetNodes = nodes.filter(node => nodeIds.includes(node.id));
                                return targetNodes;
                            }
                            catch (parseError) {
                                console.log('Error parsing array match:', parseError);
                                return [];
                            }
                        }
                    }
                }
                return [];
            }
            catch (error) {
                console.log('Error in identifyTargetNodes:', error);
                return [];
            }
        });
    }
    // STEP 5-6: Extract code snippets and send to Claude for modification
    modifyCodeSnippets(prompt, targetNodes) {
        return __awaiter(this, void 0, void 0, function* () {
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
                // FIXED: Better error handling for response
                if (!response.content || response.content.length === 0) {
                    console.log('No response content received from Claude for code modification');
                    return new Map();
                }
                const firstBlock = response.content[0];
                if ((firstBlock === null || firstBlock === void 0 ? void 0 : firstBlock.type) === 'text') {
                    const text = firstBlock.text;
                    const jsonMatch = text.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                        try {
                            const modifications = JSON.parse(jsonMatch[1]);
                            const modMap = new Map();
                            for (const [nodeId, modifiedCode] of Object.entries(modifications)) {
                                modMap.set(nodeId, modifiedCode);
                            }
                            return modMap;
                        }
                        catch (parseError) {
                            console.log('Error parsing modifications JSON:', parseError);
                            console.log('Raw response:', text);
                            return new Map();
                        }
                    }
                }
                return new Map();
            }
            catch (error) {
                console.log('Error in modifyCodeSnippets:', error);
                return new Map();
            }
        });
    }
    // STEP 7-8: Replace exact code ranges with modified snippets
    applyModifications(filePath, targetNodes, modifications) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.projectFiles.get(filePath);
            if (!file) {
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
                }
            }
            modifiedContent = lines.join('\n');
            try {
                yield fs_1.promises.writeFile(file.path, modifiedContent, 'utf8');
                return true;
            }
            catch (error) {
                console.log('Error writing modified file:', error);
                return false;
            }
        });
    }
    // Main workflow following your exact 8-step process
    processModification(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // STEP 1: Build project file tree + metadata
                console.log('Step 1: Building project tree...');
                yield this.buildProjectTree();
                if (this.projectFiles.size === 0) {
                    return { success: false, error: 'No React files found in project' };
                }
                console.log(`Found ${this.projectFiles.size} React files`);
                // STEP 2: Claude analyzes project tree to determine relevant files + scope
                console.log('Step 2: Identifying relevant files...');
                let fileAnalysis = yield this.identifyRelevantFiles(prompt);
                // FALLBACK: If no files identified, search all files one by one
                if (fileAnalysis.files.length === 0) {
                    console.log('Fallback: Searching all files...');
                    fileAnalysis = yield this.fallbackFileSearch(prompt);
                }
                if (fileAnalysis.files.length === 0) {
                    return {
                        success: false,
                        error: 'No relevant files found',
                        debug: {
                            totalFiles: this.projectFiles.size,
                            fileList: Array.from(this.projectFiles.keys())
                        }
                    };
                }
                const { files: relevantFiles, scope } = fileAnalysis;
                console.log(`Found ${relevantFiles.length} relevant files with scope: ${scope}`);
                // Handle based on scope
                if (scope === 'FULL_FILE') {
                    console.log('Processing full file modifications...');
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
                    console.log('Processing targeted node modifications...');
                    const modifiedRanges = [];
                    // Process each relevant file with AST
                    for (const filePath of relevantFiles) {
                        console.log(`Processing file: ${filePath}`);
                        // STEP 3: Parse file with AST to produce detailed trees
                        const astNodes = this.parseFileWithAST(filePath);
                        if (astNodes.length === 0) {
                            console.log(`No AST nodes found in ${filePath}`);
                            continue;
                        }
                        console.log(`Found ${astNodes.length} AST nodes in ${filePath}`);
                        // STEP 4: Claude pinpoints exact AST nodes needing modification
                        const targetNodes = yield this.identifyTargetNodes(prompt, filePath, astNodes);
                        if (targetNodes.length === 0) {
                            console.log(`No target nodes identified in ${filePath}`);
                            continue;
                        }
                        console.log(`Identified ${targetNodes.length} target nodes in ${filePath}`);
                        // STEP 5-6: Extract code snippets and send to Claude for modification
                        const modifications = yield this.modifyCodeSnippets(prompt, targetNodes);
                        if (modifications.size === 0) {
                            console.log(`No modifications generated for ${filePath}`);
                            continue;
                        }
                        console.log(`Generated ${modifications.size} modifications for ${filePath}`);
                        // STEP 7-8: Replace exact code ranges with modified snippets
                        const success = yield this.applyModifications(filePath, targetNodes, modifications);
                        if (success) {
                            console.log(`Successfully applied modifications to ${filePath}`);
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
                        else {
                            console.log(`Failed to apply modifications to ${filePath}`);
                        }
                    }
                    if (modifiedRanges.length > 0) {
                        return {
                            success: true,
                            selectedFiles: relevantFiles,
                            approach: 'TARGETED_NODES',
                            modifiedRanges
                        };
                    }
                    else {
                        return {
                            success: false,
                            error: 'No modifications were successfully applied',
                            debug: {
                                relevantFiles: relevantFiles,
                                scope: scope
                            }
                        };
                    }
                }
            }
            catch (error) {
                console.log('Error in processModification:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    debug: {
                        stack: error instanceof Error ? error.stack : undefined,
                        projectFiles: this.projectFiles.size
                    }
                };
            }
        });
    }
}
exports.IntelligentFileModifier = IntelligentFileModifier;
//# sourceMappingURL=filemodifier.js.map