import { snippetManager } from "../../src/utils/snippetManager";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("SnippetManager", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("print('Hello, world!')"),
      } as Response)
    );
    snippetManager.updateConfig({
      exclude: ["**/malformed/**", "**/missing-name/**"],
      supportedLanguages: ["python"],
    });
  });

  it("Can get a snippet", async () => {
    const snippet = await snippetManager.getSnippet("test", "python");
    expect(snippet).toBe("print('Hello, world!')");
  });

  it("Can display info for a snippet", () => {
    const displayInfo = snippetManager.getSnippetDisplayInfo("test");
    expect(displayInfo).toEqual({
      languages: ["python"],
      defaultLanguage: "python",
      imports: {
        python: ["from typing import Any"],
      },
    });
  });

  it("Can update config and clear cache", async () => {
    // First, fetch a snippet to populate cache
    await snippetManager.getSnippet("test", "python");
    expect(snippetManager["cache"].size).toBe(1);

    // Update config with new settings
    const newConfig = {
      baseUrl: "http://new-url.com/snippets",
      supportedLanguages: ["typescript"],
      exclude: ["**/malformed/**", "**/missing-name/**", "**/new-exclude/**"],
    };
    snippetManager.updateConfig(newConfig);

    // Verify cache is cleared
    expect(snippetManager["cache"].size).toBe(0);

    // Verify new config is applied
    expect(snippetManager["config"].baseUrl).toBe(newConfig.baseUrl);
    expect(snippetManager["config"].supportedLanguages).toEqual(
      newConfig.supportedLanguages
    );
    expect(snippetManager["config"].exclude).toEqual(newConfig.exclude);
  });
});
