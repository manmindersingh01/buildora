import Anthropic from '@anthropic-ai/sdk';
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
export declare class IntelligentFileModifier {
    private anthropic;
    private reactBasePath;
    private projectFiles;
    constructor(anthropic: Anthropic, reactBasePath: string);
    private buildProjectTree;
    private analyzeFile;
    private escapeRegExp;
    private fallbackFileSearch;
    private determineScopeForFallbackFiles;
    private handleFullFileModification;
    private extractComponentName;
    private checkForButtons;
    private checkForSignin;
    private isMainFile;
    private buildProjectSummary;
    private identifyRelevantFiles;
    private parseFileWithAST;
    private identifyTargetNodes;
    private modifyCodeSnippets;
    private applyModifications;
    processModification(prompt: string): Promise<ModificationResult>;
}
export {};
