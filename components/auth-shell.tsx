import Image from "next/image";
import { Reveal } from "@/components/motion-primitives";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-shell grid min-h-[calc(100svh-4.5rem)] items-center justify-stretch gap-4 py-10">
      <Reveal className="flex items-center justify-center">{children}</Reveal>
    </div>
  );
}
