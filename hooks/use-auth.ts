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
            await router.push("/login");
            toast.success("Account created successfully");
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
            await router.push("/chat");
            toast.success("welcome back");
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
            await router.push("/login");
            toast.success("signed out");
            resolve();
          },
        },
      });
    });
  };

  return { signUp, signIn, signOut };
}
