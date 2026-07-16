import Image from "next/image";
import { Camera, ExternalLink, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageMotion, Reveal } from "@/components/motion-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contacts = [
  [MapPin, "نشانی", "شیراز، شهرک صنعتی بزرگ شیراز، بلوار صنعت جنوبی، خیابان ۱۰۱، فرعی ۱۰۳", "https://maps.google.com/?q=29.478706374677504,52.54372870296799"],
  [Phone, "تلفن", "07191099114", "tel:07191099114"],
  [Mail, "ایمیل", "poolad.saghf@yahoo.com", "mailto:poolad.saghf@yahoo.com"],
] as const;

export default function ContactPage() {
  return (
    <PageMotion className="section-shell space-y-8 py-8 sm:space-y-12 sm:py-14">
      <Reveal>
        <div className="premium-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
          <div className="bg-primary/12 absolute -top-28 -left-20 size-80 rounded-full blur-3xl" />
          <div className="relative max-w-3xl">
            <Badge variant="secondary">ارتباط با ما</Badge>
            <h1 className="mt-5 text-4xl font-bold sm:text-6xl">راه‌های ارتباطی</h1>
            <p className="text-muted-foreground mt-5 text-base leading-8">اطلاعات تماس و نشانی تعاونی پولاد سقف خلیج فارس</p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {contacts.map(([Icon, label, value, href]) => (
          <Reveal key={label}>
            <Card className="premium-panel group h-full">
              <CardContent className="p-6">
                <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl"><Icon /></span>
                <p className="mt-5 text-sm font-bold">{label}</p>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-muted-foreground hover:text-primary mt-2 flex items-start gap-2 text-sm leading-7 transition-colors">
                  <span className={label !== "نشانی" ? "ltr-number" : undefined}>{value}</span>
                  <ExternalLink className="mt-1 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="premium-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.25fr_.75fr]">
          <a className="relative min-h-[520px] overflow-hidden" target="_blank" rel="noreferrer" href="https://maps.google.com/?q=29.478706374677504,52.54372870296799">
            <Image src="/location.png" alt="موقعیت تعاونی پولاد سقف خلیج فارس" fill sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            <span className="absolute right-6 bottom-6 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/65 px-4 py-2 text-sm text-white backdrop-blur-md"><MapPin className="size-4 text-primary" /> مشاهده در نقشه</span>
          </a>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <Badge variant="secondary" className="w-fit">شبکه‌های اجتماعی</Badge>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">ارتباط مستقیم</h2>
            <p className="text-muted-foreground mt-4 leading-8">از راه‌های زیر با تعاونی پولاد سقف خلیج فارس در ارتباط باشید.</p>
            <div className="mt-8 grid gap-3">
              <Button size="lg" variant="outline" className="justify-start" render={<a target="_blank" rel="noreferrer" href="https://wa.me/+989101179114" />}><MessageCircle /> واتساپ</Button>
              <Button size="lg" variant="outline" className="justify-start" render={<a target="_blank" rel="noreferrer" href="https://t.me/PooladSaghf_TPS" />}><Send /> تلگرام</Button>
              <Button size="lg" variant="outline" className="justify-start" render={<a target="_blank" rel="noreferrer" href="https://instagram.com/pooladsaghfcoop" />}><Camera /> اینستاگرام</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </PageMotion>
  );
}
