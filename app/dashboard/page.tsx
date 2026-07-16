import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AlertTriangle, Boxes, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import { getDashboardSummary } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageMotion, Reveal } from "@/components/motion-primitives";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role === "user") redirect("/dashboard/orderslist");
  const data = await getDashboardSummary();
  const cards = [[Clock3,"در انتظار بررسی",data.pending],[CheckCircle2,"سفارش تایید شده",data.resolved],[Boxes,"محصول فعال",data.products],[UsersRound,"کاربر",data.users],[AlertTriangle,"موجودی کم",data.lowStock]] as const;
  return <PageMotion className="space-y-8"><Reveal className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-primary">داشبورد</p><h1 className="mt-2 text-3xl font-black">نمای کلی</h1></div><Button render={<Link href="/dashboard/orderslist" />}>بررسی سفارشات</Button></Reveal><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([Icon,label,value]) => <Reveal key={label}><Card className="premium-panel h-full"><CardHeader><span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary"><Icon /></span></CardHeader><CardContent><p className="text-3xl font-black">{value.toLocaleString("fa-IR")}</p><CardTitle className="mt-2 text-sm text-muted-foreground">{label}</CardTitle></CardContent></Card></Reveal>)}</div></PageMotion>;
}
