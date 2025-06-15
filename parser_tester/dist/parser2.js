"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGeneratedCodeFlexible = parseGeneratedCodeFlexible;
function parseGeneratedCodeFlexible(response) {
    var _a, _b, _c;
    const files = [];
    let fileIndex = 0;
    // Pattern 1: <file>path</file> followed by <code>content</code>
    const fileTagRegex = /<file>(.*?)<\/file>\s*<code>([\s\S]*?)<\/code>/g;
    // Pattern 2: <code> with optional // File: comment
    const codeOnlyRegex = /<code>\s*(?:\/\/\s*File:\s*([^\n]+)\n)?([\s\S]*?)<\/code>/g;
    // Pattern 3: ```language blocks with file paths
    const markdownRegex = /```(?:tsx?|javascript|typescript)?\s*(?:\/\/\s*File:\s*([^\n]+)\n)?([\s\S]*?)```/g;
    let match;
    // First, try to match <file> + <code> pattern
    while ((match = fileTagRegex.exec(response)) !== null) {
        const filePath = ((_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || `file_${fileIndex}.tsx`;
        const fileContent = match[2].trim();
        if (fileContent) {
            files.push({
                path: filePath,
                content: fileContent,
            });
            fileIndex++;
        }
    }
    // If no file tags found, try code-only pattern
    if (files.length === 0) {
        // Reset regex
        codeOnlyRegex.lastIndex = 0;
        while ((match = codeOnlyRegex.exec(response)) !== null) {
            const filePath = ((_b = match[1]) === null || _b === void 0 ? void 0 : _b.trim()) || `file_${fileIndex}.tsx`;
            const fileContent = match[2].trim();
            if (fileContent) {
                files.push({
                    path: filePath,
                    content: fileContent,
                });
                fileIndex++;
            }
        }
    }
    // If still no files found, try markdown code blocks
    if (files.length === 0) {
        // Reset regex
        markdownRegex.lastIndex = 0;
        while ((match = markdownRegex.exec(response)) !== null) {
            const filePath = ((_c = match[1]) === null || _c === void 0 ? void 0 : _c.trim()) || `file_${fileIndex}.tsx`;
            const fileContent = match[2].trim();
            if (fileContent) {
                files.push({
                    path: filePath,
                    content: fileContent,
                });
                fileIndex++;
            }
        }
    }
    return files;
}
