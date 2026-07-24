import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SiteAssistant from "@/components/SiteAssistant";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
      <SiteAssistant />
    </>
  );
}
