import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <div className="space-y-2 border-b border-border pb-6 dark:border-[#27272A]">
        <Skeleton className="h-8 w-32 rounded-none" />
        <Skeleton className="h-4 w-72 rounded-none" />
      </div>
      <Skeleton className="h-40 w-full rounded-none" />
      <Skeleton className="h-64 w-full rounded-none" />
    </div>
  );
}
