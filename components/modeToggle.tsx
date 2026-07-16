"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SwitchTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  if (!mounted) return <div className="size-8" aria-hidden />;
  const dark = resolvedTheme === "dark";
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-background/60 px-2 py-1.5" />
        }
      >
        <Sun className="size-3.5 text-muted-foreground" />
        <Switch checked={dark} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} aria-label="تغییر پوسته" />
        <Moon className="size-3.5 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>تغییر تم</TooltipContent>
    </Tooltip>
  );
}
