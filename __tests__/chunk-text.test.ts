import { describe, it, expect } from "vitest";
import { splitIntoChunks } from "@/lib/chunk-text";

describe("splitIntoChunks", () => {
  it("returns an empty array for empty or whitespace-only text", () => {
    expect(splitIntoChunks("")).toEqual([]);
    expect(splitIntoChunks("   \n  ")).toEqual([]);
  });

  it("splits text into chunks of at most chunkSize words", () => {
    const text = Array.from({ length: 1200 }, (_, i) => `w${i}`).join(" ");
    const chunks = splitIntoChunks(text, 500);

    expect(chunks).toHaveLength(3);
    expect(chunks[0].split(" ")).toHaveLength(500);
    expect(chunks[1].split(" ")).toHaveLength(500);
    expect(chunks[2].split(" ")).toHaveLength(200);
  });

  it("treats newlines and repeated spaces as word separators", () => {
    const chunks = splitIntoChunks("a  b\nc\n\nd", 2);
    expect(chunks).toEqual(["a b", "c d"]);
  });

  it("does not lose or duplicate words", () => {
    const words = Array.from({ length: 777 }, (_, i) => `w${i}`);
    const chunks = splitIntoChunks(words.join(" "), 100);
    expect(chunks.join(" ").split(" ")).toEqual(words);
  });
});
