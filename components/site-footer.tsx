import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-border/60 bg-card/55 mt-20 border-t backdrop-blur-xl">
      <div className="section-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_.8fr_.8fr]">
        <div className="grid gap-2">
          <p className="text-lg font-black">شرکت تعاونی پولاد سقف خلیج فارس</p>
          <p className="text-muted-foreground max-w-xl text-sm leading-7">
            شیراز، شهرک صنعتی بزرگ شیراز، بلوار صنعت جنوبی، خیابان ۱۰۱، فرعی ۱۰۳
          </p>
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=615722&Code=VkstxmHUhnXEiwS3sSiYiil3X4E4frIN"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=615722&Code=VkstxmHUhnXEiwS3sSiYiil3X4E4frIN"
              alt=""
              className="h-16 w-16 cursor-pointer"
              // @ts-ignore
              code="VkstxmHUhnXEiwS3sSiYiil3X4E4frIN"
            />
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-bold">دسترسی</p>
          <Link
            className="text-muted-foreground hover:text-foreground block"
            href="/home/products"
          >
            محصولات
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground block"
            href="/home/about"
          >
            درباره ما
          </Link>
          <Link
            className="text-muted-foreground hover:text-foreground block"
            href="/home/contact"
          >
            ارتباط با ما
          </Link>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-bold">ارتباط</p>
          <a
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            href="tel:07191099114"
          >
            <Phone className="size-4" />{" "}
            <span className="ltr-number">07191099114</span>
          </a>
          <a
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            href="mailto:poolad.saghf@yahoo.com"
          >
            <Mail className="size-4" /> poolad.saghf@yahoo.com
          </a>
          <a
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            target="_blank"
            rel="noreferrer"
            href="https://maps.google.com/?q=29.478706374677504,52.54372870296799"
          >
            <MapPin className="size-4" /> مسیریابی
          </a>
        </div>
      </div>
      <Separator />
      <div className="section-shell text-muted-foreground flex flex-wrap items-center justify-center gap-2 py-5 text-center text-xs">
        <span>تعاونی پولاد سقف خلیج فارس</span>
        <Separator orientation="vertical" />

        <span>
          طراحی شده با ❤️ توسط تیم{" "}
          <a
            className="text-primary hover:underline"
            href="https://webarae.vercel.app"
          >
            وب آرای
          </a>
        </span>
        <Separator orientation="vertical" />

        <span dir="ltr">
          © {new Date().getFullYear()} Webarae. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
