import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
