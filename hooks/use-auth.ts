import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();

  const signUp = async (name: string, email: string, password: string) => {
    await authClient.signUp.email({
      name,
      email,
      password,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("welcome to nexus");
          router.push("/dashboard");
        },
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("welcome back");
          router.push("/chat");
        },
      },
    });
  };

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("signed out");
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  return { signUp, signIn, signOut };
}
