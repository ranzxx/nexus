"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { profileSchema } from "@/lib/schemas";

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
    defaultValues: { name: user?.name },
  });

  async function onSubmit(data: ProfileForm) {
    await authClient.updateUser({
      name: data.name,
      image: imageUrl || undefined,
      fetchOptions: {
        onSuccess: () => {
          toast.success("profile updated!");
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
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="text-lg">
            {user?.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            appearance={{
              button:
                "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-orange-400",
              allowedContent: "text-zinc-500",
            }}
            onClientUploadComplete={(res) => {
              setImageUrl(res[0].ufsUrl);
              toast.success("image uploaded!");
            }}
            onUploadError={(error) => {
              toast.error(error.message);
            }}
          />
        </div>
      </div>

      <form
        id="profile-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-sm">name</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">email</label>
          <Input value={user?.email} disabled />
        </div>
      </form>

      <Button
        type="submit"
        form="profile-form"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "saving..." : "save changes"}
      </Button>
    </div>
  );
}
