import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();

  const signUp = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      authClient.signUp.email({
        name,
        email,
        password,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            reject(new Error(ctx.error.message));
          },
          onSuccess: async () => {
            toast.success("Account created successfully");
            await router.push("/login");
            resolve();
          },
        },
      });
    });
  };

  const signIn = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            reject(new Error(ctx.error.message));
          },
          onSuccess: async () => {
            toast.success("welcome back");
            await router.push("/chat");
            resolve();
          },
        },
      });
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve, reject) => {
      authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
            reject(new Error(ctx.error.message));
          },
          onSuccess: async () => {
            toast.success("signed out");
            await router.push("/login");
            resolve();
          },
        },
      });
    });
  };

  return { signUp, signIn, signOut };
}
