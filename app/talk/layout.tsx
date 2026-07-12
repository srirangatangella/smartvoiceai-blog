import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to your AI Assistant",
  description: "Have a live voice conversation with your Smart Voice AI assistant, right in your browser.",
  robots: { index: false, follow: false },
};

export default function TalkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
