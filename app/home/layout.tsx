import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
