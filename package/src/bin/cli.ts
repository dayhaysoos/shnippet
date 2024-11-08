import { SnippetExtractor } from "../index.js";
import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let config;

async function loadConfig(configPath: string) {
  const configModule = await import(configPath);
  return configModule.config;
}

async function main() {
  const args = process.argv.slice(2);

  const configFlagIndex = args.indexOf("--config");
  if (configFlagIndex !== -1 && args.length > configFlagIndex + 1) {
    const configPath = path.resolve(process.cwd(), args[configFlagIndex + 1]);
    config = await loadConfig(configPath);
  } else {
    console.error(
      "Error: --config flag is required. Please specify a config file path."
    );
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, "../../../");
  config.rootDirectory = path.resolve(projectRoot, config.rootDirectory);
  config.snippetOutputDirectory = path.resolve(
    projectRoot,
    config.snippetOutputDirectory
  );

  // Check for "clear" argument to clear the output directory
  if (args.includes("clear")) {
    clearOutputDirectory(config.snippetOutputDirectory);
    return;
  }

  const structureFlagIndex = args.indexOf("--structure");
  if (structureFlagIndex !== -1 && args.length > structureFlagIndex + 1) {
    const structureValue = args[structureFlagIndex + 1];
    const validStructures = ["flat", "match", "organized", "byLanguage"];
    if (validStructures.includes(structureValue)) {
      config.outputDirectoryStructure = structureValue;
    } else {
      console.error(
        `Invalid output directory structure: '${structureValue}'. Valid options are: ${validStructures.join(
          ", "
        )}`
      );
      process.exit(1);
    }
  } else if (structureFlagIndex !== -1) {
    console.error(
      "The --structure flag requires a value. Valid options are: flat, match, organized, byLanguage"
    );
    process.exit(1);
  }

  // Use SnippetExtractor with the config
  const extractor = new SnippetExtractor(config);
  extractor.extractSnippets();
}

function clearOutputDirectory(snippetOutputDirectory: string) {
  if (fs.existsSync(snippetOutputDirectory)) {
    rimraf.sync(snippetOutputDirectory);
  } else {
    console.log(`Output directory does not exist: ${snippetOutputDirectory}`);
  }
}

main();
