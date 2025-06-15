"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiData = parseApiData;
function unescapeString(str) {
    return str.replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
}
function parseApiData(input) {
    try {
        const data = JSON.parse(input);
        // Extract and unescape code files
        const codeFiles = data.files.map((file) => ({
            path: file.path,
            content: unescapeString(file.content)
        }));
        // Extract API endpoints (no unescaping needed here)
        const apiEndpoints = data.apiEndpoints.map((endpoint) => ({
            method: endpoint.method,
            path: endpoint.path,
            description: endpoint.description
        }));
        return {
            codeFiles,
            apiEndpoints
        };
    }
    catch (error) {
        throw new Error(`Failed to parse input data: ${error instanceof Error ? error.message : String(error)}`);
    }
}
