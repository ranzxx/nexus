import { describe, it, expect } from "vitest";
import { splitIntoChunks } from "@/lib/rag";

describe("splitIntoChunks", () => {
  it("should split text into chunks of correct size", () => {
    const words = Array(1000).fill("word").join(" ");
    const chunks = splitIntoChunks(words, 500);
    expect(chunks).toHaveLength(2);
  });

  it("should not create empty chunks", () => {
    const text = "hello world";
    const chunks = splitIntoChunks(text, 500);
    chunks.forEach((chunk) => {
      expect(chunk.trim()).not.toBe("");
    });
  });

  it("should handle empty string", () => {
    const chunks = splitIntoChunks("", 500);
    expect(chunks).toHaveLength(0);
  });

  it("should handle text smaller than chunk size", () => {
    const text = "short text";
    const chunks = splitIntoChunks(text, 500);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("short text");
  });
});
