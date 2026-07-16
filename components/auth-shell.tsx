import Image from "next/image";
import { Reveal } from "@/components/motion-primitives";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-shell grid min-h-[calc(100svh-4.5rem)] items-center gap-8 py-10 lg:grid-cols-2">
      <Reveal className="order-2 lg:order-1">{children}</Reveal>
      <Reveal className="order-1 hidden lg:block"><div className="premium-panel relative min-h-[620px] overflow-hidden rounded-[2rem]"><Image src="/login.jpg" alt="پولاد سقف" fill sizes="50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-10 text-white"><p className="text-3xl font-black">تعاونی پولاد سقف خلیج فارس</p><p className="mt-3 text-white/70">ساخت بناهای استاندارد و مقاوم</p></div></div></Reveal>
    </div>
  );
}
