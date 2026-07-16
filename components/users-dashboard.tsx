"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { changeUserRole, deleteUserAccount } from "@/actions/admin";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRecord, UserRole } from "@/lib/domain";

export function UsersDashboard({ users }: { users: UserRecord[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const filtered = useMemo(() => users.filter((user) => `${user.name ?? ""} ${user.number} ${user.code ?? ""}`.includes(query.trim())), [users, query]);
  function setRole(id: string, role: UserRole) { startTransition(async () => { const result = await changeUserRole({ id, role }); if (!result.success) { toast.error(result.error); return; } toast.success(result.message); router.refresh(); }); }
  function remove(id: string) { startTransition(async () => { const result = await deleteUserAccount(id); if (!result.success) { toast.error(result.error); return; } toast.success(result.message); router.refresh(); }); }
  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-black">کاربران</h1><p className="mt-2 text-sm text-muted-foreground">مدیریت دسترسی کاربران</p></div><div className="relative"><Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی نام، تلفن یا کد" className="h-10 min-w-72 pr-9" /></div></div><div className="grid gap-4 xl:grid-cols-2">{filtered.map((user) => <Card key={user._id} className="premium-panel"><CardHeader className="flex-row items-start justify-between"><div><CardTitle>{user.name || "بدون نام"}</CardTitle><a href={`tel:${user.number}`} className="mt-2 block text-sm text-muted-foreground ltr-number">{user.number}</a></div><Badge variant="secondary">{user.role === "admin" ? "مدیر" : user.role === "employee" ? "کارمند" : "کاربر"}</Badge></CardHeader><CardContent className="grid gap-2 text-sm sm:grid-cols-2"><p><span className="text-muted-foreground">کد ملی / شرکت: </span>{user.code || "—"}</p><p><span className="text-muted-foreground">کد پستی: </span>{user.zipCode || "—"}</p><p className="sm:col-span-2"><span className="text-muted-foreground">نشانی: </span>{user.address || "—"}</p></CardContent><CardFooter className="justify-between gap-3 border-t pt-5"><Select items={{ admin: "مدیر", employee: "کارمند", user: "کاربر" }} value={user.role} onValueChange={(value) => setRole(user._id, value as UserRole)} disabled={isPending}><SelectTrigger className="w-40"><UserCog /><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="admin">مدیر</SelectItem><SelectItem value="employee">کارمند</SelectItem><SelectItem value="user">کاربر</SelectItem></SelectContent></Select><AlertDialog><AlertDialogTrigger render={<Button variant="destructive" size="icon" disabled={isPending} aria-label="حذف کاربر" />}><Trash2 /></AlertDialogTrigger><AlertDialogContent dir="rtl"><AlertDialogHeader><AlertDialogTitle>حذف کاربر</AlertDialogTitle><AlertDialogDescription>حساب این کاربر حذف شود؟ کاربری که سفارش فعال دارد قابل حذف نیست.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>انصراف</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => remove(user._id)}>حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></CardFooter></Card>)}</div></div>;
}
