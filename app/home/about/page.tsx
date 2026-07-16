import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Factory, Gauge, MapPin, ShieldCheck } from "lucide-react";
import { AutoCarousel } from "@/components/autoCarousel";
import { PageMotion, Reveal } from "@/components/motion-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const facts = [
  [Building2, "۱۳۸۲", "سال تأسیس"],
  [Factory, "۱۵٬۰۰۰", "مترمربع مساحت کارخانه"],
  [Gauge, "۵۰٬۰۰۰", "تن ظرفیت سالیانه خرپای میلگردی"],
  [ShieldCheck, "۳۰٬۰۰۰", "تن ظرفیت سالیانه میلگرد سرد نوردیده"],
] as const;

export default function AboutPage() {
  return (
    <PageMotion className="section-shell space-y-8 py-8 sm:space-y-12 sm:py-14">
      <Reveal>
        <div className="premium-panel relative min-h-[58svh] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
          <AutoCarousel />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-950/68 to-slate-950/15" />
          <div className="relative z-10 flex min-h-[58svh] max-w-3xl flex-col justify-center p-7 text-white sm:p-12 lg:p-16">
            <Badge className="w-fit border-white/20 bg-white/10 text-white">درباره ما</Badge>
            <h1 className="mt-6 text-4xl leading-[1.25] font-bold sm:text-6xl">تعاونی پولاد سقف خلیج فارس</h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-white/70">ساخت بناهای استاندارد و مقاوم طبق مقررات ملی ساختمان</p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map(([Icon, value, label]) => (
          <Reveal key={label}>
            <Card className="premium-panel h-full">
              <CardContent className="p-6">
                <span className="bg-primary/12 text-primary grid size-11 place-items-center rounded-xl"><Icon /></span>
                <p className="font-heading text-primary mt-5 text-3xl font-bold">{value}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-7">{label}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="premium-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-2">
          <div className="relative min-h-[430px] lg:order-2">
            <Image src="/Pic-24.jpg" alt="محوطه تولید پولاد سقف" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <Badge variant="secondary" className="w-fit">پیشینه مجموعه</Badge>
            <h2 className="mt-5 text-3xl font-bold sm:text-5xl">تولید برای ساخت‌وساز استاندارد</h2>
            <p className="text-muted-foreground mt-7 text-justify leading-9">
              شرکت تعاونی پولاد سقف خلیج فارس در سال ۱۳۸۲ با سرمایه‌گذاری بخش خصوصی و استفاده از تسهیلات بانکی تأسیس و به بهره‌برداری رسید. انگیزه احداث این کارخانه، تولید خرپای میلگردی سرد نوردیده، گرم نوردیده و کشش مفتول برای ساخت بناهای استاندارد و مقاوم طبق مقررات ملی ساختمان است.
            </p>
            <p className="text-muted-foreground mt-5 text-justify leading-9">
              این تعاونی در شهرک بزرگ صنعتی شیراز و در زمینی به مساحت تقریبی پانزده هزار مترمربع احداث شده است. ماشین‌آلات نصب‌شده از ماشین‌آلات تمام اتوماتیک اروپایی است.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button render={<Link href="/home/products" />}>مشاهده محصولات <ArrowLeft /></Button>
              <Button variant="outline" render={<Link href="/home/contact" />}><MapPin /> ارتباط با ما</Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="premium-panel grid gap-8 rounded-[2rem] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          <div>
            <Badge variant="secondary">ظرفیت تولید</Badge>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">خرپای میلگردی و میلگرد سرد نوردیده</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl leading-8">ظرفیت تولید سالیانه مجموعه حدود ۵۰٬۰۰۰ تن خرپای میلگردی و ۳۰٬۰۰۰ تن میلگرد سرد نوردیده است.</p>
          </div>
          <Button size="lg" render={<Link href="/home/products" />}>ثبت سفارش <ArrowLeft /></Button>
        </div>
      </Reveal>
    </PageMotion>
  );
}
