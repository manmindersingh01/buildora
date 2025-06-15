import React, { useContext, useState } from "react";
import { MyContext } from "../context/FrontendStructureContext";
import axios from "axios";
import { parseApiData } from "../utils/backendcodeParser";

const ChatPage = () => {
  //@ts-ignore
  const { value, setValue } = useContext(MyContext);
  console.log(value, "value");
  console.log(typeof value);
  console.log(JSON.stringify(value, null, 2), "jfasghdcv");

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async () => {
    console.log(prompt, "this is the user prompt");
    const message =
      `You are analyzing a Vite React project structure that uses Tailwind CSS for styling. Based on the user's requirement and the provided project structure, identify which files need to be modified to implement the requested changes , .
RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "files_to_modify": ["array of existing file paths that need changes"],
  "files_to_create": ["array of new file paths that need to be created"],
  "reasoning": "brief explanation of why these files were selected",
  "dependencies": ["array of npm packages that might need to be installed"],
  "notes": "additional implementation notes or considerations"
}

Consider the file structure carefully and be specific about file paths. If a change affects styling, consider both the component file and any related configuration files. If it's a new feature, consider all the files needed for complete implementation including routing, state management, and API integration if applicable.

PROJECT STRUCTURE: ${JSON.stringify(value, null, 2)}` +
      `USER REQUIREMENT: ${JSON.stringify(
        prompt
      )}  , while giving the answer try to use the sane name of files used in the PROJECT STRUCTURE , dont assume name and if we need to create files then  also analyze the structre given and then make the new files  files according to it.`;

    console.log(message, "this is the prompt for the llm");
    const res = await axios.post("http://localhost:3000/generateChanges", {
      prompt: message,
    });

    console.log(
      res.data.content[0].text,
      "these are files that are needed to change"
    );
    const data = res.data.content[0].text;
    console.log(data);

    const filesToChange = await axios.post(
      "http://localhost:3000/extractFilesToChange",
      {
        pwd: "/Users/manmindersingh/Desktop/code /ai-webisite-builder/react-base-temp",
        analysisResult: data,
      }
    );
    console.log(filesToChange.data.files);

    const updatedFile = await axios.post("http://localhost:3000/modify", {
      files: filesToChange.data.files,
      prompt: prompt,
    });
    console.log(updatedFile);
    const parsedData = JSON.parse(updatedFile.data.content[0].text);
    const result = parsedData.map((item) => ({
      path: item.path,
      content: item.content,
    }));

    console.log("parsed data", result);

    await axios.post("http://localhost:3000/write-files", {
      baseDir:
        "/Users/manmindersingh/Desktop/code /ai-webisite-builder/react-base-temp",
      files: result,
    });
  };

  return (
    <div className="">
      this is the chat section
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ChatPage;
