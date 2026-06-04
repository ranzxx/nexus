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

type ProfileForm = z.infer<typeof profileSchema>;

type Props = {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
};

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(user?.image ?? "");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  async function onSubmit(data: ProfileForm) {
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
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src={imageUrl} />
            <AvatarFallback className="text-xl">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Profile photo</h2>
            <p className="text-sm text-muted-foreground">
              Upload an image to personalize your Nexus account.
            </p>

            <UploadButton<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              appearance={{
                button:
                  "!h-9 !w-auto !px-4 rounded-md !bg-foreground !text-background hover:!bg-foreground/90 text-sm",
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
                toast.success("Image uploaded");
              }}
              onUploadError={() => {
                toast.error("Image upload failed. Please try again.");
              }}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-medium">Account information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your basic profile details.
        </p>

        <form
          id="profile-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email ?? ""} disabled />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </section>
    </div>
  );
}
