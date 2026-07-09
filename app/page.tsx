"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mic,
  Play,
  ArrowRight,
  PhoneCall,
  Calendar,
  Layers,
  Mail,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const payload = {
      ...formData,
      source: "Agency Main Website",
    };

    const N8N_WEBHOOK_URL =
      "https://floppier-pronominally-jairo.ngrok-free.dev/webhook/submit-lead";

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", mobile: "", email: "", website: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };

  return (
    <>
      <div className="glow-bg"></div>

      {/* Header / Nav */}
      <nav>
        <Link href="/" className="nav-logo">
          <Mic className="h-6 w-6 text-primary" />
          <span>
            SMART VOICE <span className="text-primary font-extrabold">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#demo">Live Demo</a>
          <Link href="/blog">Blog</Link>
          <a href="#contact">Contact</a>
        </div>

        {/* Desktop CTA */}
        <div className="nav-cta hidden md:flex">
          <Link href="/demo?client=apas" className="btn btn-outline py-2 px-5">
            <Play className="h-4 w-4 fill-white" /> Live Demo
          </Link>
          <a href="#contact" className="btn btn-primary py-2 px-5">
            Partner With Us
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white hover:text-primary focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-[73px] left-0 w-full bg-[#030305] border-b border-[rgba(255,255,255,0.08)] z-999 flex flex-col p-6 gap-4 md:hidden">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Services
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Live Demo
          </a>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Blog
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            Contact
          </a>
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/demo?client=apas"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline justify-center py-2.5"
            >
              <Play className="h-4 w-4 fill-white" /> Live Demo
            </Link>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary justify-center py-2.5"
            >
              Partner With Us
            </a>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="hero">
        <h1>
          Voice-First AI Agents That
          <br />
          <span className="gradient-text">Close Deals 24/7</span>
        </h1>
        <p>
          Stop losing revenue to missed calls. We build hyper-realistic AI Voice
          Agents that handle sales, support, and appointments instantly.
        </p>

        <div className="hero-btns">
          <Link href="/demo?client=apas" className="btn btn-primary">
            Experience the Voice AI <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#contact" className="btn btn-outline">
            Get Free Consultation
          </a>
        </div>
      </div>

      {/* Services Section */}
      <div className="section" id="services">
        <div className="section-header">
          <h2>Enterprise-Grade Capabilities</h2>
          <p>Our AI doesn't just talk. It works.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="icon-box">
              <PhoneCall className="h-6 w-6" />
            </div>
            <h3>Inbound Receptionist</h3>
            <p>
              Never miss a lead. Our AI answers calls instantly, answers FAQs,
              and qualifies potential clients before routing them to you.
            </p>
          </div>
          <div className="card">
            <div className="icon-box">
              <Calendar className="h-6 w-6" />
            </div>
            <h3>Automated Booking</h3>
            <p>
              The AI integrates with your calendar (Google/Outlook) to book
              appointments in real-time while on the phone with the customer.
            </p>
          </div>
          <div className="card">
            <div className="icon-box">
              <Layers className="h-6 w-6" />
            </div>
            <h3>CRM Integration</h3>
            <p>
              Every conversation is transcribed and data-synced to your CRM
              (HubSpot, Salesforce) via our custom secure integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="section" id="demo">
        <div className="demo-preview">
          <div className="demo-text">
            <h2>
              <span className="text-primary">Real-Time</span> Latency Test
            </h2>
            <p className="mb-8 text-base text-gray-300">
              Experience the speed of our "Sneha" Sales Agent. Capable of
              handling complex real estate queries, handling objections, and
              booking site visits.
            </p>
            <Link href="/demo?client=apas" className="btn btn-primary">
              <Mic className="h-5 w-5" /> Talk to Sneha Now
            </Link>
          </div>
          <div className="demo-visual">
            <img
              src="https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=800&auto=format&fit=crop"
              className="ai-theme-img"
              alt="AI Headset Visual"
              style={{ opacity: 0.8, mixBlendMode: "screen" }}
            />

            <div className="wave-container">
              <div className="wave-bar" style={{ animationDelay: "0s" }}></div>
              <div className="wave-bar" style={{ animationDelay: "0.1s" }}></div>
              <div className="wave-bar" style={{ animationDelay: "0.2s" }}></div>
              <div className="wave-bar" style={{ animationDelay: "0.3s" }}></div>
              <div className="wave-bar" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form / Contact */}
      <div className="section" id="contact">
        <div className="form-section">
          <div>
            <h1 className="text-5xl font-bold leading-[1.1] mb-5">
              Ready to Automate Your Business?
            </h1>
            <p className="text-lg text-gray-400 mb-10">
              Book a free consultation. We will analyze your workflow and build a
              custom AI demo for your niche.
            </p>

            <div className="mb-10 flex flex-col gap-4">
              <a href="mailto:contact@smartvoiceai.in" className="contact-detail mt-0">
                <Mail className="h-6 w-6 text-primary" /> contact@smartvoiceai.in
              </a>
              <a
                href="https://wa.me/916303919752"
                target="_blank"
                rel="noreferrer"
                className="contact-detail mt-0"
              >
                {/* Whatsapp custom SVG */}
                <svg
                  className="h-6 w-6 text-primary fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.03-2.847-6.87C16.399 2.1 13.962 1.085 12.01 1.085c-5.405 0-9.809 4.384-9.813 9.784-.002 2.033.528 4.022 1.536 5.766l-.974 3.557 3.639-.954zm10.902-7.305c-.292-.146-1.727-.853-1.993-.95-.266-.098-.46-.146-.653.146-.193.293-.748.95-.916 1.142-.169.193-.337.217-.629.071-.29-.146-1.228-.452-2.339-1.444-.864-.771-1.448-1.724-1.618-2.016-.17-.293-.018-.451.129-.595.132-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.048-.365-.024-.51-.073-.146-.653-1.573-.895-2.157-.235-.568-.475-.49-.653-.499-.169-.008-.363-.01-.557-.01-.195 0-.51.073-.777.365-.266.293-1.016.993-1.016 2.42 0 1.427 1.039 2.805 1.184 3.001.146.195 2.046 3.125 4.957 4.381.693.3 1.233.478 1.655.612.697.22 1.332.19 1.834.115.56-.083 1.727-.706 1.972-1.389.245-.683.245-1.267.172-1.389-.073-.12-.266-.195-.558-.341z" />
                </svg>{" "}
                +91-6303919752
              </a>
            </div>

            <div className="flex gap-5 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> 24/7 Availability
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> 10x ROI
              </div>
            </div>
          </div>

          <div className="form-box">
            <form id="leadForm" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 99999 88888"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Business Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="website">Your Website</label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                />
              </div>

              <button
                type="submit"
                className="submit-btn disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Processing..." : "Request Quote"}
              </button>

              {status === "success" && (
                <p
                  id="status"
                  className="text-center mt-4 text-primary font-bold block"
                >
                  ✅ Request Sent! We'll call you soon.
                </p>
              )}

              {status === "error" && (
                <p className="text-center mt-4 text-red-500 font-bold block">
                  ❌ Error sending request. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">SMART VOICE AI</div>
        <p className="footer-contact">
          <a href="mailto:contact@smartvoiceai.in">
            <Mail className="h-4 w-4" /> Email Us
          </a>{" "}
          |
          <a
            href="https://wa.me/916303919752"
            target="_blank"
            rel="noreferrer"
          >
            {/* Whatsapp icon SVG */}
            <svg
              className="h-4 w-4 fill-current align-middle"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.03-2.847-6.87C16.399 2.1 13.962 1.085 12.01 1.085c-5.405 0-9.809 4.384-9.813 9.784-.002 2.033.528 4.022 1.536 5.766l-.974 3.557 3.639-.954zm10.902-7.305c-.292-.146-1.727-.853-1.993-.95-.266-.098-.46-.146-.653.146-.193.293-.748.95-.916 1.142-.169.193-.337.217-.629.071-.29-.146-1.228-.452-2.339-1.444-.864-.771-1.448-1.724-1.618-2.016-.17-.293-.018-.451.129-.595.132-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.048-.365-.024-.51-.073-.146-.653-1.573-.895-2.157-.235-.568-.475-.49-.653-.499-.169-.008-.363-.01-.557-.01-.195 0-.51.073-.777.365-.266.293-1.016.993-1.016 2.42 0 1.427 1.039 2.805 1.184 3.001.146.195 2.046 3.125 4.957 4.381.693.3 1.233.478 1.655.612.697.22 1.332.19 1.834.115.56-.083 1.727-.706 1.972-1.389.245-.683.245-1.267.172-1.389-.073-.12-.266-.195-.558-.341z" />
            </svg>{" "}
            WhatsApp Us
          </a>
        </p>
        <p className="mt-5 text-gray-500">
          &copy; 2026 Smart Voice AI. All rights reserved.
        </p>
      </footer>
    </>
  );
}
