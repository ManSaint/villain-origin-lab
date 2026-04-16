import { describe, expect, it } from "vitest";
import { buildImageUrl } from "../pollinations";

describe("buildImageUrl", () => {
  it("encodes prompt and returns valid URL", () => {
    const url = buildImageUrl("a dark castle at night");
    expect(url).toContain("image.pollinations.ai/prompt/");
    expect(url).toContain(encodeURIComponent("a dark castle at night"));
    expect(url).toContain("model=flux");
    expect(url).toContain("width=1024");
    expect(url).toContain("height=576");
    expect(url).toContain("nologo=true");
  });

  it("handles prompts with special characters", () => {
    const url = buildImageUrl('villain & darkness, "evil"');
    expect(url).not.toContain('"evil"');
    expect(url).not.toContain("& darkness");
  });
});
