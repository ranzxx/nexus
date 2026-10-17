"use client";

import AuthCard from "@/components/auth/auth-card";
import { RegisterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    await signUp(data.name, data.email, data.password);
  }

  return (
    <AuthCard
      title="Start with your documents."
      description="Upload, ask questions, and get answers from your files instantly."
    >
      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="name"
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "#A1A1AA", fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  name="name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your name"
                  autoComplete="name"
                  className="h-10 rounded-none border-[#27272A] bg-transparent text-[#FAFAFA] placeholder:text-[#52525B] focus-visible:border-[#FAFAFA] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "#A1A1AA", fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  name="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-10 rounded-none border-[#27272A] bg-transparent text-[#FAFAFA] placeholder:text-[#52525B] focus-visible:border-[#FAFAFA] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "#A1A1AA", fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="h-10 rounded-none border-[#27272A] bg-transparent text-[#FAFAFA] placeholder:text-[#52525B] focus-visible:border-[#FAFAFA] focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors focus-visible:outline-none focus-visible:text-[#FAFAFA]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="submit"
          form="register-form"
          className="w-full h-10 rounded-none bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-[#FAFAFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-sm text-center" style={{ color: "#A1A1AA" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#FAFAFA] hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
