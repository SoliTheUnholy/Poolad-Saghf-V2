"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider delay={250}>
          <MotionConfig
            reducedMotion="user"
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {children}
          </MotionConfig>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
