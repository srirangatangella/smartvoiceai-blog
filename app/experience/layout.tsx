import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your AI Assistant — Live Sample",
  robots: { index: false, follow: false },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
