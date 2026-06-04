import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account information and profile settings.
        </p>
      </div>

      <ProfileForm user={session?.user} />
    </div>
  );
}
