import { exec } from "child_process";
import path from "path";
async function buildProject(projectId) {
  const projectPath = path.join(__dirname, "../generated-sites" , projectId);
  const outputPath = path.join(__dirname, "../static-folder" , projectId,);

  const cmd = `
      docker build -t ${projectId}-builder -f Dockerfile.build-react ${projectPath} &&
      docker create --name ${projectId}-container ${projectId}-builder &&
      mkdir -p ${outputPath} &&
      docker cp ${projectId}-container:/app/build ${outputPath} &&
      docker rm ${projectId}-container &&
      docker rmi ${projectId}-builder
    `;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Build failed:\n", stderr);
    } else {
      console.log("✅ Build succeeded:\n", stdout);
      console.log(`📁 Built output available at: dist/${projectId}/build`);
    }
  });
}

buildProject("project123"); // Replace with actual project ID
