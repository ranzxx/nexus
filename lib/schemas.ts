import z from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be 8 characters"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be 8 characters"),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string(),
});

export const EditProjectSchema = z.object({
  name: z.string().min(2, "Name must be 2 characters").max(50),
  domain: z.string().url("Invalid domain").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(2, "nama minimal 2 karakter"),
});
