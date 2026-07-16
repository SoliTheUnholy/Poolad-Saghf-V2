"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Boxes,
  CircleUserRound,
  Gauge,
  KeyRound,
  LogOut,
  PackagePlus,
  ShoppingBasket,
  Store,
  UsersRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwitchTheme } from "@/components/modeToggle";
import type { UserRole } from "@/lib/domain";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
};

const nav: NavItem[] = [
  {
    href: "/dashboard",
    label: "داشبورد",
    icon: Gauge,
    roles: ["admin", "employee"],
  },
  { href: "/dashboard/orderslist", label: "سفارشات", icon: ShoppingBasket },
  { href: "/home/products", label: "ثبت سفارش جدید", icon: PackagePlus },
  {
    href: "/dashboard/lattice",
    label: "خرپا",
    icon: Boxes,
    roles: ["admin", "employee"],
  },
  {
    href: "/dashboard/coil",
    label: "کلاف",
    icon: Boxes,
    roles: ["admin", "employee"],
  },
  {
    href: "/dashboard/drawncoil",
    label: "کلاف کشیده",
    icon: Boxes,
    roles: ["admin", "employee"],
  },
  {
    href: "/dashboard/userslist",
    label: "کاربران",
    icon: UsersRound,
    roles: ["admin"],
  },
  {
    href: "/dashboard/changeinfo",
    label: "مشخصات حساب",
    icon: CircleUserRound,
  },
  { href: "/dashboard/changepassword", label: "تغییر رمز", icon: KeyRound },
];

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: UserRole };
}) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const visible = nav.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );
  return (
    <>
      {" "}
      <Sidebar side="right" variant="floating" collapsible="icon" dir="rtl">
        <SidebarHeader className="">
          <Link
            href="/home"
            className="flex h-12 items-center gap-3 overflow-hidden rounded-xl"
          >
            <span className="bg-primary/12 grid size-8 shrink-0 place-items-center rounded-md">
              <Image
                src="/logo.png"
                width={28}
                height={28}
                alt="پولاد سقف"
                className="dark:invert"
              />
            </span>
            <span className="min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-sm font-black">
                پولاد سقف
              </span>
              <span className="text-muted-foreground block truncate text-[10px]">
                پنل مدیریت سفارشات
              </span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator className={"m-0"} />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>منو</SidebarGroupLabel>
            <SidebarMenu>
              {visible.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <div className="border-sidebar-border bg-sidebar-accent/60 rounded-xl border p-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">
                  {user.name || "حساب کاربری"}
                </p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {user.role === "admin"
                    ? "مدیر"
                    : user.role === "employee"
                      ? "کارمند"
                      : "کاربر"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => signOut({ callbackUrl: "/home" })}
                aria-label="خروج"
              >
                <LogOut />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-transparent">
        <header className="border-border/60 bg-background/75 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl lg:px-7">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="rotate-180" />
            <span className="hidden text-sm font-bold sm:block">
              پنل کاربری
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" render={<Link href="/home" />}>
              <Store /> بازگشت به سایت
            </Button>
            <SwitchTheme />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
