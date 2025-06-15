interface CodeFile {
    path: string;
    content: string;
  }
  
  interface ApiEndpoint {
    method: string;
    path: string;
    description: string;
  }
  
  interface ParsedResult {
    codeFiles: CodeFile[];
    apiEndpoints: ApiEndpoint[];
  }
  
  function unescapeString(str: string): string {
    return str.replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\r/g, '\r')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\');
  }
  
  function parseApiData(input: string): ParsedResult {
    try {
      const data = JSON.parse(input);
      
      // Extract and unescape code files
      const codeFiles: CodeFile[] = data.files.map((file: any) => ({
        path: file.path,
        content: unescapeString(file.content)
      }));
      
      // Extract API endpoints (no unescaping needed here)
      const apiEndpoints: ApiEndpoint[] = data.apiEndpoints.map((endpoint: any) => ({
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description
      }));
      
      return {
        codeFiles,
        apiEndpoints
      };
    } catch (error) {
      throw new Error(`Failed to parse input data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  export { parseApiData, CodeFile, ApiEndpoint, ParsedResult };