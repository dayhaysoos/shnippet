import { config } from "../../shnip.config";

export async function getSnippet(
  snippetName: string,
  language: string = "javascript"
): Promise<string> {
  try {
    const snippetUrl = `${config.snippetOutputDirectory}/${config.version}/${language}/${snippetName}.snippet.js`;

    const response = await fetch(snippetUrl);

    if (!response.ok) {
      throw new Error(
        `Snippet not found: ${snippetName} for language: ${language}`
      );
    }

    const snippetContent = await response.text();
    return snippetContent;
  } catch (error) {
    console.error("Error loading snippet:", error);
    throw error;
  }
}
