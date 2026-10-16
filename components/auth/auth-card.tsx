import Link from "next/link";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center px-4 py-14"
      style={{ background: "#0A0A0A" }}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 mb-10 group focus-visible:outline-none"
        aria-label="Nexus — back to home"
      >
        {/* <Image
          src="/logo/nexus.svg"
          alt="Nexus"
          width={18}
          height={18}
          priority
        /> */}
        <span
          className="font-semibold text-lg tracking-tight uppercase"
          style={{ color: "#FAFAFA" }}
        >
          Nexus
        </span>
      </Link>

      <div
        className="w-full max-w-[380px] border"
        style={{
          background: "#121212",
          borderColor: "#27272A",
          borderRadius: 0,
        }}
      >
        <div
          className="px-8 pt-8 pb-6 border-b"
          style={{ borderColor: "#27272A" }}
        >
          <h1
            className="text-xl font-semibold tracking-tight leading-snug"
            style={{ color: "#FAFAFA", fontFamily: "inherit" }}
          >
            {title}
          </h1>
          <p
            className="mt-1.5 text-sm leading-relaxed"
            style={{ color: "#A1A1AA" }}
          >
            {description}
          </p>
        </div>

        <div className="px-8 py-7">{children}</div>
      </div>

      <p className="mt-6 text-xs" style={{ color: "#A1A1AA" }}>
        <Link
          href="/"
          className="hover:text-[#FAFAFA] transition-colors underline underline-offset-4"
          style={{ color: "#A1A1AA" }}
        >
          ← Back to Nexus
        </Link>
      </p>
    </div>
  );
}
