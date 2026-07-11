import Link from "next/link";
import { Mic, Mail } from "lucide-react";
import { footerNav, siteConfig } from "@/lib/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.03-2.847-6.87C16.399 2.1 13.962 1.085 12.01 1.085c-5.405 0-9.809 4.384-9.813 9.784-.002 2.033.528 4.022 1.536 5.766l-.974 3.557 3.639-.954zm10.902-7.305c-.292-.146-1.727-.853-1.993-.95-.266-.098-.46-.146-.653.146-.193.293-.748.95-.916 1.142-.169.193-.337.217-.629.071-.29-.146-1.228-.452-2.339-1.444-.864-.771-1.448-1.724-1.618-2.016-.17-.293-.018-.451.129-.595.132-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.048-.365-.024-.51-.073-.146-.653-1.573-.895-2.157-.235-.568-.475-.49-.653-.499-.169-.008-.363-.01-.557-.01-.195 0-.51.073-.777.365-.266.293-1.016.993-1.016 2.42 0 1.427 1.039 2.805 1.184 3.001.146.195 2.046 3.125 4.957 4.381.693.3 1.233.478 1.655.612.697.22 1.332.19 1.834.115.56-.083 1.727-.706 1.972-1.389.245-.683.245-1.267.172-1.389-.073-.12-.266-.195-.558-.341z" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-row">
            <span className="nav-logo-mark">
              <Mic className="h-5 w-5" />
            </span>
            <span>
              SMART VOICE <span className="text-primary">AI</span>
            </span>
          </Link>
          <p className="footer-tagline">
            Custom AI assistants for real estate and healthcare businesses across the US and India.
            They answer every call, book appointments, and sync to your CRM — 24/7, on the phone and
            on your website.
          </p>
          <div className="footer-contacts">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="h-4 w-4 text-primary" /> {siteConfig.email}
            </a>
            <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="h-4 w-4 text-primary" /> {siteConfig.phone}
            </a>
          </div>
        </div>

        {footerNav.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
        </p>
        <p className="footer-serving">Serving businesses in the United States &amp; India</p>
      </div>
    </footer>
  );
}
