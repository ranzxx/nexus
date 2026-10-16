import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
        <header className="border-b border-border pb-6 dark:border-[#27272A]">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground dark:text-[#A1A1AA]">
            Manage your account information and profile settings.
          </p>
        </header>

        <ProfileForm user={session?.user} />
      </div>
    </div>
  );
}
