import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cog,
  MapPin,
  PackageCheck,
  Phone,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { AutoCarousel } from "@/components/autoCarousel";
import { HoverLift, PageMotion, Reveal } from "@/components/motion-primitives";
import { ProductVisual } from "@/components/product-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRODUCT_NAMES, type ProductType } from "@/lib/domain";

const reasons = [
  [Users, "کادر متخصص", "به‌کارگیری مهندسین و کارگران حرفه‌ای"],
  [Building2, "بناهای استاندارد", "ساخت بناهای استاندارد و مقاوم در برابر حوادث"],
  [Cog, "بهترین ماشین‌آلات", "ماشین‌آلات تمام اتوماتیک روز اروپایی"],
  [TrendingUp, "ظرفیت تولید بالا", "ظرفیت تولید سالیانه حدود ۵۰٬۰۰۰ تن خرپای میلگردی"],
] as const;

const facts = [
  ["۱۳۸۲", "سال تأسیس"],
  ["۱۵٬۰۰۰", "مترمربع مساحت کارخانه"],
  ["۵۰٬۰۰۰", "تن ظرفیت خرپای میلگردی"],
  ["۳۰٬۰۰۰", "تن ظرفیت میلگرد سرد نوردیده"],
] as const;

const orderSteps = [
  [Settings2, "انتخاب مشخصات", "محصول، مشخصات فنی و مقدار مورد نظر را انتخاب کنید."],
  [ShoppingCart, "افزودن به سبد خرید", "محصول انتخاب‌شده را به سبد اضافه و سبد خود را تکمیل کنید."],
  [ClipboardCheck, "ثبت سفارش", "سبد خرید را به‌صورت یک سفارش برای بررسی ثبت کنید."],
  [PackageCheck, "بررسی سفارش", "وضعیت سفارش ثبت‌شده را از پنل کاربری مشاهده کنید."],
] as const;

function productHref(type: ProductType) {
  return type === 1
    ? "/home/products/lattice"
    : type === 2
      ? "/home/products/coil"
      : "/home/products/drawn";
}

export default function HomePage() {
  return (
    <PageMotion className="pb-6">
      <section className="section-shell pt-4 sm:pt-7">
        <Reveal>
          <div className="premium-panel relative min-h-[74svh] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
            <AutoCarousel />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/78 to-slate-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(250,204,21,.2),transparent_26rem)]" />
            <div className="relative z-10 flex min-h-[74svh] max-w-4xl flex-col justify-center px-6 py-20 text-white sm:px-12 lg:px-16">
              <Badge className="mb-6 w-fit border-white/20 bg-white/10 text-white backdrop-blur-md">
                تعاونی پولاد سقف خلیج فارس
              </Badge>
              <h1 className="max-w-3xl text-5xl leading-[1.22] font-bold text-balance sm:text-7xl lg:text-8xl">
                با ما بسازید
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-white/76 sm:text-2xl">
                ساخت بناهای استاندارد و مقاوم
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> خرپا</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> کلاف</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> کلاف کشیده</span>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button size="lg" className="h-12 px-6" render={<Link href="/home/products" />}>
                  ثبت سفارش <ArrowLeft />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
                  render={<Link href="/home/about" />}
                >
                  درباره ما
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal className="relative z-20 mx-3 -mt-8 sm:mx-8">
          <div className="premium-panel bg-card! grid overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([value, label]) => (
              <div key={label} className="border-border/60 px-6 py-5 not-last:border-b sm:odd:border-l lg:border-b-0 lg:not-last:border-l">
                <p className="font-heading text-primary text-3xl font-bold">{value}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-6">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section-shell py-20 sm:py-28">
        <Reveal className="mb-9 max-w-2xl">
          <Badge variant="secondary">چرا پولاد سقف؟</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">تولید برای ساخت‌وساز استاندارد</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reasons.map(([Icon, title, text]) => (
            <Reveal key={title}>
              <HoverLift className="h-full">
                <Card className="premium-panel border-border/60 h-full grow py-3">
                  <CardHeader>
                    <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl"><Icon /></span>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <p className="text-muted-foreground mt-3 text-sm leading-7">{text}</p>
                  </CardContent>
                </Card>
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pb-20 sm:pb-28">
        <Reveal>
          <div className="premium-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative min-h-[420px] overflow-hidden lg:order-2">
              <Image src="/Pic-22.jpg" alt="کارخانه تعاونی پولاد سقف خلیج فارس" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover transition-transform duration-1000 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
              <span className="absolute right-6 bottom-6 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-4 py-2 text-xs text-white backdrop-blur-md"><MapPin className="size-4 text-primary" /> شهرک بزرگ صنعتی شیراز</span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <Badge variant="secondary" className="w-fit">پولاد سقف خلیج فارس</Badge>
              <h2 className="mt-5 text-3xl font-bold sm:text-5xl">تولید صنعتی با ماشین‌آلات تمام اتوماتیک اروپایی</h2>
              <p className="text-muted-foreground mt-6 text-justify text-sm leading-8 sm:text-base sm:leading-9">
                شرکت تعاونی پولاد سقف خلیج فارس در سال ۱۳۸۲ با هدف تولید خرپای میلگردی سرد نوردیده، گرم نوردیده و کشش مفتول برای ساخت بناهای استاندارد و مقاوم طبق مقررات ملی ساختمان تأسیس شد.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button render={<Link href="/home/about" />}>درباره مجموعه <ArrowLeft /></Button>
                <Button variant="outline" render={<Link href="/home/contact" />}>راه‌های ارتباطی</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell pb-20 sm:pb-28">
        <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary">محصولات</Badge>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">انتخاب و ثبت سفارش</h2>
          </div>
          <Button variant="ghost" render={<Link href="/home/products" />}>
            مشاهده همه محصولات <ArrowLeft />
          </Button>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {([1, 2, 3] as ProductType[]).map((type) => (
            <Reveal key={type}>
              <HoverLift>
                <Card className="premium-panel group border-border/60 overflow-hidden p-0!">
                  <div className="from-primary/12 relative bg-gradient-to-b to-transparent p-7">
                    <span className="text-muted-foreground absolute top-5 right-5 text-xs">محصول {type.toLocaleString("fa-IR")}</span>
                    <ProductVisual type={type} className="mx-auto max-w-64 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <CardContent className="border-border/60 flex items-center justify-between border-t p-5">
                    <CardTitle className="text-xl">{PRODUCT_NAMES[type]}</CardTitle>
                    <Button size="sm" render={<Link href={productHref(type)} />}>ثبت سفارش <ArrowLeft /></Button>
                  </CardContent>
                </Card>
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-foreground text-background py-20 sm:py-28">
        <div className="section-shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge className="border-background/15 bg-background/10 text-background">فرآیند سفارش</Badge>
            <h2 className="mt-5 text-3xl font-bold sm:text-5xl">از انتخاب محصول تا بررسی سفارش</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {orderSteps.map(([Icon, title, text], index) => (
              <Reveal key={title}>
                <div className="border-background/15 bg-background/6 h-full rounded-2xl border p-6">
                  <div className="flex items-center justify-between"><span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-xl"><Icon /></span><span className="text-background/30 text-3xl font-black">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span></div>
                  <h3 className="mt-6 text-xl font-bold">{title}</h3>
                  <p className="text-background/60 mt-3 text-sm leading-7">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 sm:py-28">
        <Reveal>
          <div className="premium-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
            <div className="bg-primary/12 absolute -top-24 -left-20 size-72 rounded-full blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="text-primary flex items-center gap-2 text-sm font-bold"><ShieldCheck className="size-5" /> تعاونی پولاد سقف خلیج فارس</span>
                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">برای ثبت سفارش آماده‌اید؟</h2>
                <p className="text-muted-foreground mt-4 leading-8">محصول و مشخصات مورد نظر را انتخاب کنید و سفارش خود را از طریق سبد خرید ثبت کنید.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" render={<Link href="/home/products" />}>ثبت سفارش <ArrowLeft /></Button>
                <Button size="lg" variant="outline" render={<a href="tel:07191099114" />}><Phone /> تماس با ما</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageMotion>
  );
}
