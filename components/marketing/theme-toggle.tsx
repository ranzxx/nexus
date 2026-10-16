"use client";

import { useTheme } from "next-themes";
import { Button, buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { MoonIcon, SunIcon } from "lucide-react";

type ThemeToggleProps = {
  size: VariantProps<typeof buttonVariants>["size"];
};

export default function ThemeToggle({ size }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      size={size}
      variant="outline"
      className="rounded-none"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
