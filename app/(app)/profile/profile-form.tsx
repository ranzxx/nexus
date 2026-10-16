"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@uploadthing/react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { profileSchema } from "@/lib/schemas";
import type { OurFileRouter } from "@/lib/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type ProfileFormValues = z.infer<typeof profileSchema>;

type Props = {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card dark:border-[#27272A] dark:bg-[#121212]">
      <div className="border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground dark:border-[#27272A] dark:text-[#A1A1AA]">
        {label}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(user?.image ?? "");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    await authClient.updateUser({
      name: data.name,
      image: imageUrl || undefined,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Profile updated");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  }

  return (
    <div className="space-y-6">
      <Section label="Profile photo">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 rounded-none border border-border dark:border-[#27272A]">
            <AvatarImage src={imageUrl} className="rounded-none" />
            <AvatarFallback className="rounded-none text-xl">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground dark:text-[#A1A1AA]">
              Upload an image to personalize your Nexus account.
            </p>

            <UploadButton<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              appearance={{
                button:
                  "!h-9 !w-auto !px-4 !rounded-none !bg-foreground !text-background hover:!bg-foreground/90 font-mono text-xs uppercase tracking-wider",
                allowedContent: "hidden",
              }}
              content={{
                button: (
                  <span className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Upload photo
                  </span>
                ),
              }}
              onClientUploadComplete={(res) => {
                setImageUrl(res[0].ufsUrl);
                toast.success("Photo uploaded. Click Save changes to apply.");
              }}
              onUploadError={() => {
                toast.error("Image upload failed. Please try again.");
              }}
            />
          </div>
        </div>
      </Section>

      <Section label="Account">
        <form
          id="profile-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    className="rounded-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="rounded-none"
              />
              <p className="text-xs text-muted-foreground dark:text-[#A1A1AA]">
                Email cannot be changed.
              </p>
            </Field>
          </FieldGroup>

          <div className="flex justify-end border-t border-border pt-5 dark:border-[#27272A]">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-none font-mono text-xs uppercase tracking-wider"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Section>
    </div>
  );
}
