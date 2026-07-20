"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";
import { primaryNav, siteConfig } from "@/lib/site";
import BrandMark from "@/components/BrandMark";

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-header">
      <Link href="/" className="nav-logo" aria-label="Smart Voice AI home">
        <span className="nav-logo-mark">
          <BrandMark className="h-5 w-5" />
        </span>
        <span>
          SMART VOICE <span className="text-primary font-extrabold">AI</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="nav-links">
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="nav-cta hidden md:flex">
        <Link href="/demo?client=apas" className="btn btn-outline py-2 px-5">
          <Play className="h-4 w-4 fill-white" /> Live Demo
        </Link>
        <Link href="/book" className="btn btn-primary py-2 px-5">
          Book a Call
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white hover:text-primary focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="mobile-menu md:hidden">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/demo?client=apas"
              onClick={() => setOpen(false)}
              className="btn btn-outline justify-center py-2.5"
            >
              <Play className="h-4 w-4 fill-white" /> Live Demo
            </Link>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="btn btn-primary justify-center py-2.5"
            >
              Book a Call
            </Link>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="text-center text-sm text-gray-400 mt-1"
            >
              or WhatsApp us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
