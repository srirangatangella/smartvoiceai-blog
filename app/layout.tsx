import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Smart Voice AI | The Future of Business Automation",
  description: "Stop losing revenue to missed calls. We build hyper-realistic AI Voice Agents that handle sales, support, and appointments instantly.",
  metadataBase: new URL("https://smarvoiceai.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smart Voice AI | The Future of Business Automation",
    description: "Stop losing revenue to missed calls. We build hyper-realistic AI Voice Agents that handle sales, support, and appointments instantly.",
    url: "https://smarvoiceai.in",
    siteName: "Smart Voice AI",
    images: [
      {
        url: "/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Voice AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Voice AI | The Future of Business Automation",
    description: "Stop losing revenue to missed calls. We build hyper-realistic AI Voice Agents that handle sales, support, and appointments instantly.",
    images: ["/og/home.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full bg-[#030305] text-white font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
