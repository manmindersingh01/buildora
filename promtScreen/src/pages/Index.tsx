import { useContext, useState } from "react";
import axios from "axios";

import { parseApiData } from "../utils/backendcodeParser";
import { parseFrontendCode } from "../utils/newParserWithst";
import { MyContext } from "../context/FrontendStructureContext";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { value, setValue } = useContext(MyContext);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // const response = await axios.post(
      //   "http://localhost:3000/generatebackend",
      //   {
      //     prompt,
      //   }
      // );
      // console.log("backend", response);

      // const data = parseApiData(response.data);
      // console.log(data, "parsed");
      // const codeFiles = data.codeFiles;
      // await axios.post("http://localhost:3000/write-files", {
      //   baseDir:
      //     "/Users/manmindersingh/Desktop/code /ai-webisite-builder/backend-base-templete",
      //   files: codeFiles,
      // });

      // const frontendPrompt = `${prompt}\n\nImportant: The frontend should integrate with the following backend API endpoints:\n${data.apiEndpoints
      //   .map(
      //     (endpoint) =>
      //       `${endpoint.method} ${endpoint.path} - ${endpoint.description}`
      //   )
      //   .join("\n")}
      //    take the base url as http://localhost:3003. `;

      console.log("started ");

      const frontendres = await axios.post(
        "http://localhost:3000/generateFrontend",
        {
          prompt,
        }
      );
      console.log(frontendres);

      // const parse = parseInput(frontendres);
      console.log("completed");
      const parsedFrontend = parseFrontendCode(
        `${frontendres.data.content[0].text}`
      );

      setValue(parsedFrontend.structure);
      console.log("parsed frontend", parsedFrontend.codeFiles);
      console.log(parsedFrontend.structure, "structure");

      // console.log(parse);
      //   const frontenddata = await parseGeneratedCodeFlexible(
      //     frontendres.data.content[0].text
      //   );
      console.log("now starting to insert files ");
      await axios.post("http://localhost:3000/write-files", {
        files: parsedFrontend.codeFiles,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-48">
        <h1 className="text-2xl font-bold mb-4">Enter your prompt</h1>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="mb-4"
        />
        <button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Index;
