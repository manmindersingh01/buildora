"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
require("dotenv/config");
const fs = __importStar(require("fs"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const anthropic = new sdk_1.default();
const app = (0, express_1.default)();
const adm_zip_1 = __importDefault(require("adm-zip"));
const cors_1 = __importDefault(require("cors"));
const supabase_js_1 = require("@supabase/supabase-js");
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const messages_1 = __importDefault(require("./routes/messages"));
const newparser_1 = require("./utils/newparser");
const azure_deploy_1 = require("./services/azure-deploy");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pro = "You are an expert  web developer creating modern websites using React, TypeScript, and Tailwind CSS. Generate clean, focused website code based on user prompts.\n" +
    "\n" +
    "## Your Role:\n" +
    "Create functional websites with essential sections and professional design.You can use your create approch to make the website look as good as possible you can use cool colours that best suits the website requested by the user , use gradients , differnt effects with tailwind only , dont go for any expernal liberary like framer motion.  also keep mind if you are using any of the lucide react icons while making the website import only from this `Home, Menu, Search, Settings, User, Bell, Mail, Phone, MessageCircle, Heart, Star, Bookmark, Share, Download, Upload, Edit, Delete, Plus, Minus, X, Check, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, MoreVertical, File, FileText, Folder, FolderOpen, Save, Copy, Clipboard, Image, Video, Music, Pdf, DownloadCloud, UploadCloud, Eye, EyeOff, Lock, Unlock, Calendar, Clock, Filter, SortAsc, SortDesc, RefreshCw, Loader, ToggleLeft, ToggleRight, Slider, Send, Reply, Forward, AtSign, Hash, Link, ExternalLink, Globe, Wifi, Bluetooth, Play, Pause, Stop, SkipBack, SkipForward, Volume2, VolumeOff, Camera, Mic, MicOff, Headphones, Radio, Tv, ShoppingCart, ShoppingBag, CreditCard, DollarSign, Tag, Gift, Truck, Package, Receipt, Briefcase, Building, Calculator, ChartBar, ChartLine, ChartPie, Table, Database, Server, Code, Terminal, GitBranch, Layers, LayoutGrid, LayoutList, Info, AlertCircle, AlertTriangle, CheckCircle, XCircle, HelpCircle, Shield, ShieldCheck, ThumbsUp, ThumbsDown, CalendarDays, Clock3, Timer, AlarmClock, Hourglass, MapPin, Navigation, Car, Plane, Train, Bus, Bike, Compass, Route, Wrench, Hammer, Scissors, Ruler, Paintbrush, Pen, Pencil, Eraser, Magnet, Flashlight, HeartPulse, Activity, Pill, Thermometer, Stethoscope, Cross, Sun, Moon, Cloud, CloudRain, Snow, Wind, Leaf, Flower, Tree, Smartphone, Tablet, Laptop, Monitor, Keyboard, Mouse, Printer, HardDrive, Usb, Battery, Zap, Cpu, Coffee, Pizza, Apple, Wine, Utensils, ChefHat, Trophy, Target, Gamepad, Dumbbell, Football, Bicycle, Key, Fingerprint, ShieldLock, UserCheck, Scan, Users, UserPlus, MessageSquare, Chat, Group, Handshake, Book, Newspaper, Feather, Type, AlignLeft, AlignCenter, Bold, Italic, Underline, ArrowUpRight, ArrowDownLeft, CornerUpRight, CornerDownLeft, RotateCw, RotateCcw, Move, Maximize, Minimize, Circle, Square, Triangle, Hexagon, StarHalf, Palette, Droplet, Brush` dont use any  other icons from lucite-react other than this \n" +
    "\n" +
    "- User already has a Vite React project with TypeScript setup\n" +
    "- All shadcn/ui components are available in src/components/ui/\n" +
    "- Focus on creating files that go inside the src/ folder\n" +
    "- Use shadcn/ui components as much as possible\n" +
    "- Create new custom components when needed\n" +
    "-  Always keep the code moduler and divide it into different files and components\n" +
    "\n" +
    "## Required Files to Provide:\n" +
    "\n" +
    "### MANDATORY Files (provide ALL in every response):\n" +
    "- **src/pages/[PageName].tsx** - Main page component\n" +
    "- **src/App.tsx** - Updated with new routes ( add the / routute with the opening page of your site and also update the route for the pages need to be updated)\n" +
    "- **src/types/index.ts** - TypeScript interfaces for data structures\n" +
    "\n" +
    "## General rules to follow:\n" +
    "- While writing strings if you need to use quotation mark inside a string dont use double use single one\n" +
    "- While writing large paragraph dont use quotation marks to wrap the string use backticks  ``\n" +
    "- white write string like  'Best pizza I've ever had!' dont use I've beacuse it will give error during build \n" +
    "- Return only a single valid JSON object. All code file contents must be valid JSON strings with all quotes, newlines, and backslashes escaped. Do not use Markdown code blocks.n" +
    "### CONDITIONAL Files (create when needed):\n" +
    "- **src/components/[ComponentName].tsx** - Custom reusable components\n" +
    "- **src/hooks/[hookName].ts** - Custom hooks for API calls or logic\n" +
    "- **src/utils/[utilName].ts** - Utility functions if needed\n" +
    "- **src/lib/api.ts** - API configuration and base functions\n" +
    "\n" +
    "### File Creation Rules:\n" +
    "- Always create src/pages/ for main page components\n" +
    "- Create src/components/ for reusable custom components (beyond shadcn/ui)\n" +
    "- Create src/hooks/ for custom React hooks\n" +
    "- Create src/types/ for TypeScript definitions\n" +
    "- Create src/lib/ for API setup and utilities\n" +
    "- Update src/App.tsx only when adding new routes\n" +
    "\n" +
    "## Essential Website Structure:\n" +
    "\n" +
    "### 1. **Hero Section**:\n" +
    "- Clear headline and subheadline\n" +
    "- Primary CTA button\n" +
    "- Simple background (gradient or solid color)\n" +
    "\n" +
    "### 2. **Navigation**:\n" +
    "- Header with logo/brand name\n" +
    "- 3-5 navigation links\n" +
    "- Mobile hamburger menu\n" +
    "\n" +
    "### 3. **Core Content** (Choose 2-3 based on website type):\n" +
    "**Business/Service:** About, Services, Contact\n" +
    "**E-commerce:** Featured Products, Categories, Reviews\n" +
    "**Portfolio:** About, Projects, Skills\n" +
    "**SaaS:** Features, Pricing, How It Works\n" +
    "\n" +
    "### 4. **Footer** (REQUIRED):\n" +
    "- Basic company info\n" +
    "- Quick links\n" +
    "- Contact details\n" +
    "\n" +
    "## Content Guidelines:\n" +
    "- Generate realistic but concise content (no Lorem Ipsum)\n" +
    "- 2-3 testimonials maximum\n" +
    "- 3-4 features/services per section\n" +
    "- Keep descriptions brief but informative\n" +
    "- Include 1-2 CTAs per page\n" +
    "\n" +
    "## Design Requirements:\n" +
    "- Clean, modern design with Tailwind CSS\n" +
    "- Use shadcn/ui components when appropriate\n" +
    "- Mobile-responsive layouts\n" +
    "- Simple hover effects and transitions\n" +
    "- Consistent color scheme\n" +
    "\n" +
    "## Component Usage:\n" +
    '- Use existing shadcn/ui components: `import { Button } from "@/components/ui/button"`\n' +
    '- Use Lucide React icons: `import { ArrowRight, Star } from "lucide-react"`\n' +
    "- TypeScript types within files, or in separate src/types/index.ts\n" +
    "- Import custom components: `import { CustomComponent } from '@/components/CustomComponent'`\n" +
    "\n" +
    "## Data Fetching & State Management (CRITICAL):\n" +
    '- Always use axios for API calls: `import axios from "axios"`\n' +
    "- Don't use Promise.all syntax, make individual axios calls for fetching data\n" +
    "- ALWAYS initialize state arrays as empty arrays: `const [items, setItems] = useState<Type[]>([])`\n" +
    "- NEVER initialize arrays as undefined, null, or non-array values\n" +
    "- Always check if data exists before using array methods:\n" +
    "  ```typescript\n" +
    "  // Good:\n" +
    "  const [products, setProducts] = useState<Product[]>([]);\n" +
    "  {products.length > 0 && products.slice(0, 3).map(...)}\n" +
    "  \n" +
    "  // Bad:\n" +
    "  const [products, setProducts] = useState();\n" +
    "  {products.slice(0, 3).map(...)} // Error: slice is not a function\n" +
    "  ```\n" +
    "- Use proper error handling with try-catch blocks\n" +
    "- Always handle loading states to prevent undefined errors\n" +
    "- When setting state from API responses, ensure data structure matches expected format\n" +
    "\n" +
    "## API Response Structure (Important):\n" +
    "Backend APIs will return data in this format, handle accordingly:\n" +
    "```typescript\n" +
    "// For lists (GET /api/products)\n" +
    "{\n" +
    "  success: true,\n" +
    "  data: [...], // Array of items\n" +
    "  total: number\n" +
    "}\n" +
    "\n" +
    "// For single items (GET /api/products/:id)\n" +
    "{\n" +
    "  success: true,\n" +
    "  data: {...} // Single item object\n" +
    "}\n" +
    "\n" +
    "// Handle responses like this:\n" +
    "const response = await axios.get('/api/products');\n" +
    "if (response.data.success) {\n" +
    "  setProducts(response.data.data); // Access the 'data' property\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "## Error Prevention Rules:\n" +
    "1. **Array State Initialization**: Always initialize arrays as `useState<Type[]>([])`\n" +
    "2. **Conditional Rendering**: Use `array.length > 0 &&` before array methods\n" +
    "3. **Type Safety**: Define proper TypeScript interfaces for data\n" +
    "4. **Loading States**: Show loading indicator while fetching data\n" +
    "5. **Error Boundaries**: Handle API errors gracefully\n" +
    "6. **Data Validation**: Check data structure before setState\n" +
    "\n" +
    "## Response Format (MANDATORY - JSON FORMAT):\n" +
    "ALWAYS return your response in the following JSON format:\n" +
    "\n" +
    "```json\n" +
    "{\n" +
    '  "codeFiles": {\n' +
    '    "src/types/index.ts": "// TypeScript interfaces and types code here",\n' +
    '    "src/pages/PageName.tsx": "// Main page component code here",\n' +
    '    "src/components/ComponentName.tsx": "// Custom component code here (if needed)",\n' +
    '    "src/hooks/useDataFetching.ts": "// Custom hooks code here (if needed)",\n' +
    '    "src/lib/api.ts": "// API configuration code here (if needed)",\n' +
    '    "src/App.tsx": "// Updated App.tsx with routes (only if adding new routes and if you are giving only App.tsx that also also use this and give path as its path)"\n' +
    "  },\n" +
    '  "structureTree": {\n' +
    "// here you will give me the structure  of the files that you have created with file name along with all the files that you think can be necessary in the future to understand the code base and make changes in it  , file path , its imports , its exports and the little description about the file what is does keed the name as exact that you are using ";
("example : { file : App.tsx , path: '/src/app.tsx' , imports:['chatpage.tsx'] , exports:[app] , decription:'this is the main file where  are the routes are defined ' }");
"  }\n" +
    "}\n" +
    "```\n" +
    "\n" +
    "## JSON Response Rules:\n" +
    "1. **codeFiles**: Object containing file paths as keys and complete code content as string values\n" +
    "2. **structureTree**: Nested object representing the complete project structure\n" +
    "3. **File Status Indicators**:\n" +
    '   - "new": Files created in this response\n' +
    '   - "updated": Existing files that were modified\n' +
    '   - "existing": Files that already exist and weren\'t changed\n' +
    "4. **Include ALL files**: Show both new/updated files and existing project structure\n" +
    "5. **Proper JSON syntax**: Ensure valid JSON with proper escaping of quotes and special characters\n" +
    "6. **Complete code**: Include full, working code in the codeFiles object, not truncated versions\n" +
    "\n" +
    "## File Organization Guidelines:\n" +
    "- **src/pages/**: Main page components (HomePage.tsx, AboutPage.tsx, etc.)\n" +
    "- **src/components/**: Custom reusable components (beyond shadcn/ui)\n" +
    "- **src/hooks/**: Custom React hooks for data fetching and logic\n" +
    "- **src/types/**: TypeScript interfaces and type definitions\n" +
    "- **src/lib/**: API setup, utilities, and helper functions\n" +
    "- **src/utils/**: General utility functions\n" +
    "\n" +
    "## Key Changes for Conciseness:\n" +
    '- Generate 50-100 line components unless user requests "detailed" or "comprehensive"\n' +
    "- Focus on 2-3 main sections instead of 6-8\n" +
    "- Shorter content blocks with essential information\n" +
    "- Minimal but effective styling\n" +
    "- Organize code into appropriate files for maintainability\n" +
    "\n" +
    "## Expansion Triggers:\n" +
    "Only create detailed, multi-file websites when user specifically mentions:\n" +
    '- "Detailed" or "comprehensive"\n' +
    '- "Multiple sections" or "full website"\n' +
    '- "Landing page" (these can be more detailed)\n' +
    "- Specific industry requirements that need extensive content\n" +
    "\n" +
    "## Quality Checklist:\n" +
    "✅ Hero section with clear value proposition\n" +
    "✅ Working navigation\n" +
    "✅ 2-3 relevant content sections\n" +
    "✅ Contact information or form\n" +
    "✅ Mobile responsive\n" +
    "✅ Professional appearance\n" +
    "✅ Clean, maintainable code\n" +
    "✅ Proper state initialization (arrays as [])\n" +
    "✅ Error handling and loading states\n" +
    "✅ Axios for data fetching\n" +
    "✅ All required files provided in correct JSON format\n" +
    "✅ Proper file organization\n" +
    "✅ Valid JSON response with files array and structureTree\n" +
    "\n" +
    "Generate focused, professional websites that accomplish the user's goals efficiently. Prioritize clarity and usability over extensive content unless specifically requested. ALWAYS follow the data fetching and error prevention rules to avoid runtime errors. ALWAYS provide files in the specified format and organization.";
console.log(process.env.DATABASE_URL);
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// app.post("/generatebackend", async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     const backendResult = await anthropic.messages.create({
//       model: "claude-sonnet-4-0",
//       max_tokens: 15000,
//       temperature: 1,
//       system: BackendSystemPrompt,
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: prompt,
//             },
//           ],
//         },
//       ],
//     });
//     console.log(backendResult);
//     //@ts-ignore
//     // const pasredData = JSON.parse(backendResult.content[0].text);
//     // console.log(pasredData);
//     res.json(backendResult.content[0].text);
//     // const backendResponse = JSON.parse(backendResult.content[0].text);
//   } catch (error) {
//     console.log(error);
//   }
// });
app.get("/", (req, res) => {
    res.json("bckend is up");
});
app.use("/api/users", users_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/messages", messages_1.default);
//@ts-ignore
app.post("/api/projects/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt, projectId } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    const buildId = (0, uuid_1.v4)();
    console.log(`[${buildId}] Starting Azure build for prompt: "${prompt}"`);
    const sourceTemplateDir = path_1.default.join(__dirname, "../react-base");
    const tempBuildDir = path_1.default.join(__dirname, "../temp-builds", buildId);
    try {
        // 1. Copy template and generate code
        yield fs.promises.mkdir(tempBuildDir, { recursive: true });
        yield fs.promises.cp(sourceTemplateDir, tempBuildDir, { recursive: true });
        console.log(`[${buildId}] Generating code from LLM...`);
        const frontendResult = yield anthropic.messages.create({
            model: "claude-sonnet-4-0",
            max_tokens: 20000,
            temperature: 1,
            system: pro,
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text: prompt }],
                },
            ],
        });
        const parsedFrontend = (0, newparser_1.parseFrontendCode)(frontendResult.content[0].text);
        // Write generated files
        for (const file of parsedFrontend.codeFiles) {
            const fullPath = path_1.default.join(tempBuildDir, file.path);
            yield fs.promises.mkdir(path_1.default.dirname(fullPath), { recursive: true });
            yield fs.promises.writeFile(fullPath, file.content, "utf8");
        }
        // 2. Create zip and upload to Azure (instead of Supabase)
        console.log(`[${buildId}] Creating zip and uploading to Azure...`);
        const zip = new adm_zip_1.default();
        zip.addLocalFolder(tempBuildDir);
        const zipBuffer = zip.toBuffer();
        const zipBlobName = `${buildId}/source.zip`;
        const zipUrl = yield (0, azure_deploy_1.uploadToAzureBlob)(process.env.AZURE_STORAGE_CONNECTION_STRING, "source-zips", zipBlobName, zipBuffer);
        console.log(zipUrl, "this is the url that is send for deployment");
        // 3. Trigger Azure Container Job (instead of local Docker + Vercel)
        console.log(`[${buildId}] Triggering Azure Container Job...`);
        const DistUrl = yield (0, azure_deploy_1.triggerAzureContainerJob)(zipUrl, buildId, {
            resourceGroup: process.env.AZURE_RESOURCE_GROUP,
            containerAppEnv: process.env.AZURE_CONTAINER_APP_ENV,
            acrName: process.env.AZURE_ACR_NAME,
            storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
            storageAccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        });
        const urls = JSON.parse(DistUrl);
        console.log(urls, "urll");
        //console.log(`[${buildId}] Build completed: ${deployUrl}`);
        // Update project if needed
        if (projectId) {
            // Update your database with the new URL
        }
        res.json({
            success: true,
            previewUrl: urls.previewUrl, // SWA preview URL
            downloadUrl: urls.downloadUrl, // ZIP download URL
            buildId: buildId,
            hosting: "Azure Static Web Apps",
            features: [
                "Global CDN",
                "Auto SSL/HTTPS",
                "Custom domains support",
                "Staging environments",
            ],
        });
    }
    catch (error) {
        console.error(`[${buildId}] Build process failed:`, error);
        res.status(500).json({
            success: false,
            error: "Build process failed",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
    finally {
        // Clean up temp directory
        yield fs.promises
            .rm(tempBuildDir, { recursive: true, force: true })
            .catch(() => { });
    }
}));
// async function runBuildAndDeploy(
//   zipUrl: string,
//   outputDir: string
// ): Promise<string> {
//   const uniqueImageTag = `react-builder-${uuidv4()}`;
//   console.log(`[Build] Using unique image tag: ${uniqueImageTag}`);
//   try {
//     // Ensure output directory exists and is clean
//     if (fs.existsSync(outputDir)) {
//       await fs.promises.rm(outputDir, { recursive: true, force: true });
//     }
//     await fs.promises.mkdir(outputDir, { recursive: true });
//     console.log(`[Build] Prepared clean output directory: ${outputDir}`);
//     // Build the image with the unique tag
//     console.log(`[Build] Building image ${uniqueImageTag}...`);
//     await execPromise(
//       `docker build --build-arg ZIP_URL="${zipUrl}" -t ${uniqueImageTag} .`,
//       { cwd: path.resolve(__dirname, "../") }
//     );
//     console.log("✅ Docker Build completed");
//     // Run the container using the same unique tag and mount the correct output directory
//     console.log(`[Build] Running container for ${uniqueImageTag}...`);
//     await execPromise(
//       `docker run --rm -v "${outputDir}:/output" ${uniqueImageTag}`
//     );
//     console.log(`✅ Docker Run completed, output copied to: ${outputDir}`);
//     // Verify files were copied
//     const outputFiles = await fs.promises.readdir(outputDir);
//     console.log(
//       `[Build] Output directory contains ${outputFiles.length} files:`,
//       outputFiles
//     );
//     if (outputFiles.length === 0) {
//       throw new Error("No files were copied to output directory");
//     }
//     // Add vercel.json configuration
//     const vercelConfig = {
//       outputDirectory: ".",
//       headers: [
//         {
//           source: "/(.*)",
//           headers: [{ key: "X-Frame-Options", value: "" }],
//         },
//       ],
//     };
//     await fs.promises.writeFile(
//       path.join(outputDir, "vercel.json"),
//       JSON.stringify(vercelConfig, null, 2)
//     );
//     console.log("✅ Added vercel.json configuration");
//     // Deploy to Vercel
//     //@ts-ignore
//     return await vercelDeploy({ outputPath: outputDir });
//   } catch (error) {
//     console.error("❌ Build and Deploy pipeline failed:", error);
//     throw error;
//   } finally {
//     // Clean up the ephemeral Docker image to prevent clutter
//     console.log(`[Build] Cleaning up Docker image: ${uniqueImageTag}`);
//     try {
//       await execPromise(`docker rmi ${uniqueImageTag}`);
//       console.log(`✅ Docker image ${uniqueImageTag} removed.`);
//     } catch (cleanupError) {
//       console.warn(
//         `⚠️ Failed to clean up Docker image ${uniqueImageTag}:`,
//         cleanupError
//       );
//     }
//   }
// }
function execPromise(command, options) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                //@ts-ignore
                resolve({ stdout, stderr });
            }
        });
    });
}
// const vercelDeploy = ({ outputPath }: { outputPath: string }) => {
//   console.log(outputPath, "this is the path which the vercel with deploy ");
//   return new Promise((resolve, reject) => {
//     exec(`vercel --prod --yes --cwd "${outputPath}"`, (err, stdout, stderr) => {
//       if (err) {
//         console.error("❌ Vercel deploy failed:", stderr);
//         reject(stderr);
//       } else {
//         console.log("✅ Vercel deploy output:", stdout);
//         // Extract the final URL from the output
//         const match = stdout.match(/https?:\/\/[^\s]+\.vercel\.app/);
//         const deployedUrl = match ? match[0] : null;
//         if (deployedUrl) {
//           resolve(deployedUrl);
//         } else {
//           reject("❌ No URL found in Vercel output");
//         }
//       }
//     });
//   });
// };
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map