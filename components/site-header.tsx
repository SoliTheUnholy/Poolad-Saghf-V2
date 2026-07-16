"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SwitchTheme } from "@/components/modeToggle";
import { cn } from "@/lib/utils";

const links = [
  ["/home", "خانه"],
  ["/home/products", "محصولات"],
  ["/home/about", "درباره ما"],
  ["/home/contact", "ارتباط با ما"],
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/home" ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  return (
    <header className="border-border/60 bg-background/75 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="section-shell flex h-18 items-center justify-between gap-4">
        <Link href="/home" className="flex min-w-0 items-center gap-3">
          <span className="border-primary/25 bg-primary/10 grid size-11 shrink-0 place-items-center rounded-2xl border shadow-sm">
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt="نشان پولاد سقف"
              className="size-8 object-contain dark:invert"
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-black">
              تعاونی پولاد سقف
            </span>
            <span className="text-muted-foreground block truncate text-[11px]">
              خلیج فارس
            </span>
          </span>
        </Link>

        <nav className="border-border/60 bg-card/70 hidden items-center rounded-full border p-1 lg:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isCurrent(pathname, href) &&
                  "bg-foreground text-background hover:text-background shadow-sm",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SwitchTheme />
          {status === "authenticated" ? (
            <>
              <Button
                variant="outline"
                size="icon-lg"
                render={<Link href="/home/cart" aria-label="سبد خرید" />}
              >
                <ShoppingCart />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      size={"lg"}
                      variant="outline"
                      className="hidden sm:inline-flex"
                    />
                  }
                >
                  <UserRound />
                  {session.user.name || "حساب کاربری"}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48" dir="rtl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      nativeButton={false}
                      render={<Link href="/dashboard" />}
                    >
                      <LayoutDashboard /> ورود به پنل
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: "/home" })}
                    >
                      <LogOut /> خروج
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:grid grid-cols-2">
              <Button
                size={"lg"}
                variant="ghost"
                render={<Link href="/home/register" />}
              >
                ثبت نام
              </Button>
              <Button size={"lg"} render={<Link href="/home/login" />}>
                <LogIn /> ورود
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="lg:hidden"
                  aria-label="باز کردن منو"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent
              side="right"
              dir="rtl"
              className="w-[88vw] p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b p-5 text-right">
                <SheetTitle>تعاونی پولاد سقف</SheetTitle>
                <SheetDescription>خلیج فارس</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-1 p-4">
                {links.map(([href, label]) => (
                  <SheetClose
                    key={href}
                    nativeButton={false}
                    render={
                      <Link
                        href={href}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium",
                          isCurrent(pathname, href) &&
                            "bg-primary/12 text-primary",
                        )}
                      />
                    }
                  >
                    {label}
                  </SheetClose>
                ))}
                {status === "authenticated" ? (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/home/cart"
                          className="rounded-xl px-4 py-3 text-sm font-medium"
                        />
                      }
                    >
                      سبد خرید
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/dashboard"
                          className="rounded-xl px-4 py-3 text-sm font-medium"
                        />
                      }
                    >
                      ورود به پنل
                    </SheetClose>
                  </>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Button
                          variant="outline"
                          render={<Link href="/home/register" />}
                        />
                      }
                    >
                      ثبت نام
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={<Button render={<Link href="/home/login" />} />}
                    >
                      ورود
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
