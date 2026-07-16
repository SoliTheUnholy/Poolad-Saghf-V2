import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./provider";
import { Toaster } from "@/components/ui/sonner";
import { Noto_Naskh_Arabic } from "next/font/google";
import { cn } from "@/lib/utils";

const notoNaskh = localFont({
  src: "../fonts/Vazirmatn[wght].woff2",
  variable: "--font-vazir",
  display: "swap",
});

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn[wght].woff2",
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "تعاونی پولاد سقف خلیج فارس", template: "%s | پولاد سقف" },
  description: "معرفی محصولات و ثبت سفارش تعاونی پولاد سقف خلیج فارس",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn("font-sans", vazirmatn.variable, notoNaskh.variable)}
    >
      <head>
        <meta name="enamad" content="45427967" />
      </head>
      <body className="min-h-svh overflow-x-hidden">
        <Provider>{children}</Provider>
        <Toaster position="bottom-left" richColors />
      </body>
    </html>
  );
}
