import { describe, expect, it } from "vitest";
import { buildNarrationText } from "../elevenlabs";
import type { Scene } from "../types";

describe("buildNarrationText", () => {
  it("joins scene texts with pauses", () => {
    const scenes: Scene[] = [
      { text: "First scene.", imagePrompt: "" },
      { text: "Second scene.", imagePrompt: "" },
    ];
    const text = buildNarrationText("The Dark Rise", "Doctor Null", scenes);
    expect(text).toContain("The Dark Rise");
    expect(text).toContain("First scene.");
    expect(text).toContain("Second scene.");
  });

  it("includes villain name in narration", () => {
    const text = buildNarrationText("Title", "Zara the Terrible", [
      { text: "A story.", imagePrompt: "" },
    ]);
    expect(text).toContain("Zara the Terrible");
  });
});
