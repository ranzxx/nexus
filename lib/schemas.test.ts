import { describe, expect, it } from "vitest";
import { EditProjectSchema, LoginSchema, profileSchema, ProjectSchema, RegisterSchema } from "./schemas";

describe('LoginSchema', () => {
    it('valid kalo email dan password benar', () => {
        const result = LoginSchema.safeParse({
            email: 'test@gmail.com',
            password: 'password123'
        });
        expect(result.success).toBe(true)
    })

    it('invalid kalo email salah', () => {
        const result = LoginSchema.safeParse({
          email: "salah",
          password: "password123",
        });

        expect(result.success).toBe(false);
    })

    it("invalid kalau password kurang dari 8 karakter", () => {
      const result = LoginSchema.safeParse({
        email: "test@example.com",
        password: "123",
      });

      expect(result.success).toBe(false);
    });
})

describe("RegisterSchema", () => {
  it("valid kalau name, email, password benar", () => {
    const result = RegisterSchema.safeParse({
      name: "Rangga",
      email: "rangga@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("invalid kalau name kosong", () => {
    const result = RegisterSchema.safeParse({
      name: "",
      email: "rangga@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });
});

describe("EditProjectSchema", () => {
  it("valid kalau domain adalah URL", () => {
    const result = EditProjectSchema.safeParse({
      name: "Nexus",
      domain: "https://nexus.com",
    });

    expect(result.success).toBe(true);
  });

  it("valid kalau domain kosong", () => {
    const result = EditProjectSchema.safeParse({
      name: "Nexus",
      domain: "",
    });

    expect(result.success).toBe(true);
  });

  it("invalid kalau name cuma 1 karakter", () => {
    const result = EditProjectSchema.safeParse({
      name: "A",
      domain: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("ProjectSchema", () => {
  it("valid kalau name dan domain ada", () => {
    const result = ProjectSchema.safeParse({
      name: "Nexus",
      domain: "nexus.com",
    });

    expect(result.success).toBe(true);
  });
});

describe("profileSchema", () => {
  it("invalid kalau name kurang dari 2 karakter", () => {
    const result = profileSchema.safeParse({
      name: "R",
    });

    expect(result.success).toBe(false);
  });
});