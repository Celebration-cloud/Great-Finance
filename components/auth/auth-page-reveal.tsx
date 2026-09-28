import type { ReactNode } from "react";
import { AnimatedContent } from "@/components/ui/animated-content";

export function AuthPageReveal({
  children,
  className = "w-full max-w-md",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatedContent className={className} distance={18} scale={0.975}>
      {children}
    </AnimatedContent>
  );
}
