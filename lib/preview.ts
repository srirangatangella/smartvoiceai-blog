/**
 * Shared content + theme for the /preview demo websites.
 * Used by the preview page, the floating widgets, and the demo blog route.
 * Everything is locale-neutral (no currency / country-specific wording) so the
 * same template works for US, UK, UAE, India, etc.
 */

export type Kind = "dental" | "clinic" | "realestate" | "hotel" | "gym" | "generic";

export function industryKind(industry?: string | null): Kind {
  const s = (industry || "").toLowerCase();
  if (s.includes("dental") || s.includes("dentist")) return "dental";
  if (s.includes("hospital") || s.includes("clinic") || s.includes("medical") || s.includes("doctor")) return "clinic";
  if (s.includes("real estate") || s.includes("realtor") || s.includes("propert") || s.includes("builder")) return "realestate";
  if (s.includes("hotel") || s.includes("hospitality") || s.includes("resort")) return "hotel";
  if (s.includes("gym") || s.includes("fitness") || s.includes("yoga") || s.includes("crossfit")) return "gym";
  return "generic";
}

export const IMG = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  cover: string; // unsplash id
  body: string[]; // paragraphs; "{business}" is replaced with the business name
}

export interface Theme {
  primary: string;
  primaryD: string;
  accent: string;
  hero: string;
  gallery: string[];
  kicker: string;
  tagline: string;
  bookLabel: string; // what customers "book" — used by the demo widgets
  services: readonly (readonly [string, string, string])[];
  why: readonly (readonly [string, string, string])[];
  testimonials: readonly (readonly [string, string])[];
  chips: string[]; // quick-reply chips for the demo chatbot
  blogs: BlogPost[];
}

const THEMES: Record<Kind, Theme> = {
  dental: {
    primary: "#0ea5a4", primaryD: "#0b6b66", accent: "#f4b740",
    hero: "1629909613654-28e377c37b09",
    gallery: ["1588776814546-1ffcf47267a5", "1606811841689-23dfddce3e95", "1609840114035-3c981b782dfe"],
    kicker: "Trusted Dental Care",
    tagline: "Gentle, expert dentistry for your whole family — with a smile.",
    bookLabel: "appointment",
    chips: ["Book an appointment", "Your timings?", "Do you do implants?"],
    services: [
      ["🦷", "Check-ups & Cleaning", "Preventive care that keeps your smile healthy year-round."],
      ["✨", "Cosmetic Dentistry", "Whitening, veneers and smile makeovers by experienced hands."],
      ["🩹", "Root Canal & Fillings", "Painless, precise treatment with modern techniques."],
      ["😁", "Braces & Aligners", "Straighten your teeth with options that fit your lifestyle."],
      ["🦿", "Implants & Crowns", "Restore missing teeth with natural-looking results."],
      ["🚨", "Emergency Care", "Same-day relief when you need it most."],
    ],
    why: [
      ["👩‍⚕️", "Experienced dentists", "A caring team with years of clinical expertise."],
      ["🧼", "Strict hygiene", "Sterile, modern equipment for your safety."],
      ["💳", "Easy payment plans", "Flexible options and insurance accepted."],
      ["📅", "Same-day booking", "Get seen quickly — even for emergencies."],
    ],
    testimonials: [
      ["Painless root canal and the friendliest staff I've ever met. Highly recommend!", "Priya S."],
      ["Booked online in seconds and my whole family now comes here. Spotless clinic.", "Rahul M."],
    ],
    blogs: [
      {
        slug: "5-signs-you-need-a-dentist",
        title: "5 Signs It's Time to See a Dentist",
        excerpt: "Toothaches aren't the only warning sign. Here's when to book a visit before a small problem becomes a big one.",
        minutes: 4,
        cover: "1606811841689-23dfddce3e95",
        body: [
          "Most dental problems are painless until they aren't. By the time a tooth genuinely hurts, the issue has often been developing for months. That's why regular check-ups matter — and why knowing the early warning signs can save you time, money, and discomfort.",
          "Watch for these five: bleeding gums when you brush, persistent bad breath, sensitivity to hot or cold, a dull ache when you chew, and any tooth that looks darker than the rest. Individually they may seem minor. Together, or if they persist beyond a week, they're your cue to book an appointment.",
          "At {business}, a routine visit takes less time than your lunch break and can catch these issues early. Prevention is always gentler — and far less expensive — than treatment. If you've noticed any of the signs above, it's worth getting checked.",
        ],
      },
      {
        slug: "habits-for-a-brighter-smile",
        title: "7 Everyday Habits for a Brighter, Healthier Smile",
        excerpt: "Small daily changes add up to a noticeably healthier smile. None of these take more than a minute.",
        minutes: 3,
        cover: "1588776814546-1ffcf47267a5",
        body: [
          "A healthy smile isn't just about brushing twice a day — though that's a great start. The habits around it matter just as much. Small, consistent choices protect your teeth far more than the occasional deep clean.",
          "Try these seven: brush for a full two minutes, floss once daily, drink water after meals, cut back on sugary drinks, don't brush immediately after acidic foods, replace your brush every three months, and never skip your check-up. Each one is simple, but together they make a visible difference.",
          "The team at {business} can tailor these to your specific needs during a visit. A quick professional cleaning twice a year, combined with good daily habits, keeps most people cavity-free for life.",
        ],
      },
    ],
  },
  clinic: {
    primary: "#2563eb", primaryD: "#1e40af", accent: "#38bdf8",
    hero: "1519494026892-80bbd2d6fd0d",
    gallery: ["1631217868264-e5b90bb7e133", "1666214280557-f1b5022eb634", "1606811841689-23dfddce3e95"],
    kicker: "Patient-First Healthcare",
    tagline: "Trusted, compassionate care close to home.",
    bookLabel: "appointment",
    chips: ["Book an appointment", "Your timings?", "Do you take walk-ins?"],
    services: [
      ["🩺", "General Consultation", "Experienced doctors for everyday health concerns."],
      ["🧪", "Diagnostics & Labs", "Accurate results with quick turnaround."],
      ["👨‍⚕️", "Specialist Care", "Access trusted specialists across fields."],
      ["🛡️", "Health Check-ups", "Stay ahead with regular screening packages."],
      ["💉", "Vaccination", "Safe, scheduled immunisation for all ages."],
      ["🔄", "Follow-up Care", "Continuous support through your recovery."],
    ],
    why: [
      ["👨‍⚕️", "Qualified doctors", "A team you can trust with your health."],
      ["⏱️", "Minimal wait times", "Smart scheduling that respects your time."],
      ["🧼", "Clean & safe", "Rigorous hygiene and modern facilities."],
      ["📅", "Same-day slots", "Book online in seconds, any day."],
    ],
    testimonials: [
      ["Caring doctors and hardly any waiting. Finally a clinic that respects my time.", "Anjali R."],
      ["Got my reports the same day. Professional and genuinely kind staff.", "Karthik V."],
    ],
    blogs: [
      {
        slug: "when-should-you-see-a-doctor",
        title: "When Should You Actually See a Doctor?",
        excerpt: "Not every symptom needs a visit — but some shouldn't wait. A simple guide to knowing the difference.",
        minutes: 4,
        cover: "1631217868264-e5b90bb7e133",
        body: [
          "We've all put off a doctor's visit hoping a symptom would pass. Sometimes it does. But knowing which signs are worth acting on — and which can wait — helps you stay healthy without over-worrying.",
          "See a doctor promptly for: a fever above 39°C that won't drop, chest pain or breathlessness, symptoms lasting more than a week, unexplained weight loss, or anything that suddenly gets worse. For minor colds and short-lived aches, rest and fluids are usually enough — but a quick consultation brings peace of mind.",
          "At {business}, same-day appointments make it easy to get checked without a long wait. When in doubt, a short visit is always better than a long worry.",
        ],
      },
      {
        slug: "why-preventive-checkups-matter",
        title: "Why Preventive Health Check-ups Matter",
        excerpt: "The most valuable appointments are the ones you make when you feel fine. Here's why.",
        minutes: 3,
        cover: "1666214280557-f1b5022eb634",
        body: [
          "Most serious conditions — high blood pressure, diabetes, high cholesterol — develop quietly, without symptoms, for years. A yearly check-up is the simplest way to catch them early, when they're easiest to manage.",
          "A basic preventive package usually covers blood pressure, blood sugar, cholesterol, and a general physical. It takes under an hour and gives you a clear picture of your health — plus a baseline to compare against next year.",
          "The team at {business} can recommend the right screening for your age and lifestyle. Think of it as a small investment now that prevents much bigger problems later.",
        ],
      },
    ],
  },
  realestate: {
    primary: "#14284a", primaryD: "#0d1b33", accent: "#c9a24b",
    hero: "1600585154340-be6161a56a0c",
    gallery: ["1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1600607687939-ce8a6c25118c"],
    kicker: "Your Property Partner",
    tagline: "Find the right home with a team that knows the market.",
    bookLabel: "site visit",
    chips: ["Book a site visit", "Homes in my budget?", "Do you help with loans?"],
    services: [
      ["🏡", "Buying Assistance", "Handpicked listings matched to your budget."],
      ["📈", "Selling & Valuation", "Get the best price with expert market pricing."],
      ["🔑", "Rentals & Leasing", "Verified homes and quick, hassle-free move-ins."],
      ["💼", "Investment Advisory", "Data-backed guidance on high-growth areas."],
      ["🚗", "Site Visits", "Guided visits scheduled around you."],
      ["📄", "Legal & Docs", "End-to-end paperwork handled for you."],
    ],
    why: [
      ["🏆", "Local experts", "Deep knowledge of every neighbourhood."],
      ["✅", "Verified listings", "No fake photos, no surprises."],
      ["🤝", "Honest guidance", "Advice that puts you first, not the sale."],
      ["⚡", "Fast closings", "We handle the paperwork end to end."],
    ],
    testimonials: [
      ["They found us our dream home in two weeks and handled every document. Effortless.", "Sneha & Arun"],
      ["Sold my flat above asking price. Transparent and professional throughout.", "Mohan K."],
    ],
    blogs: [
      {
        slug: "first-time-home-buyer-checklist",
        title: "The First-Time Home Buyer's Checklist",
        excerpt: "Buying your first home is exciting — and overwhelming. This checklist keeps you on track from budget to keys.",
        minutes: 5,
        cover: "1564013799919-ab600027ffc6",
        body: [
          "Your first home is likely the biggest purchase you'll ever make, so a little structure goes a long way. Before you fall in love with a listing, get clear on three numbers: your budget, your down payment, and your monthly comfort limit.",
          "Then work the checklist: get pre-approved for a loan, list your must-haves versus nice-to-haves, research the neighbourhood (schools, commute, future development), visit at different times of day, and always budget for closing costs and repairs. Never skip the paperwork review — it protects you.",
          "A good agent makes all of this easier. The team at {business} guides first-time buyers through every step, from shortlisting to signing, so you can focus on the exciting part: your new home.",
        ],
      },
      {
        slug: "sell-your-home-faster",
        title: "6 Ways to Sell Your Home Faster",
        excerpt: "The right preparation can mean the difference between weeks and months on the market. Here's what works.",
        minutes: 4,
        cover: "1512917774080-9991f1c4c750",
        body: [
          "Homes that sell quickly rarely do so by luck. They're priced right, presented well, and marketed to the right buyers. The good news: most of what makes a home sell faster is within your control.",
          "Focus on these six: price it correctly from day one, declutter and deep-clean, fix the small stuff, use bright professional photos, be flexible with viewings, and highlight what makes the location special. Overpricing early is the most common — and most costly — mistake.",
          "At {business}, we combine accurate local pricing with modern marketing to get your home in front of serious buyers fast. A free valuation is the best first step.",
        ],
      },
    ],
  },
  hotel: {
    primary: "#a67c34", primaryD: "#7a5a24", accent: "#c9a24b",
    hero: "1566073771259-6a8506099945",
    gallery: ["1571896349842-33c89424de2d", "1551882547-ff40c63fe5fa", "1540541338287-41700207dee6"],
    kicker: "Warm Hospitality",
    tagline: "Comfort, warmth and hospitality you'll remember.",
    bookLabel: "room",
    chips: ["Book a room", "What are your rates?", "Do you host events?"],
    services: [
      ["🛏️", "Rooms & Suites", "Comfortable stays for business and leisure."],
      ["🍽️", "Fine Dining", "Fresh, local flavours prepared to delight."],
      ["🎉", "Events & Banquets", "Perfect venues for every celebration."],
      ["🛎️", "Room Service", "Round-the-clock service at your convenience."],
      ["💼", "Conferences", "Well-equipped spaces for your meetings."],
      ["🧭", "Concierge", "Local expertise to make your stay effortless."],
    ],
    why: [
      ["⭐", "Rated by guests", "Consistently loved for service and comfort."],
      ["📍", "Prime location", "Close to everything that matters."],
      ["🧑‍🍳", "Great dining", "A kitchen that delights every palate."],
      ["🕛", "24/7 service", "We're here whenever you need us."],
    ],
    testimonials: [
      ["Spotless rooms, warm staff and incredible food. We'll be back every trip.", "Deepa N."],
      ["Perfect venue for our event — seamless service from start to finish.", "Vikram T."],
    ],
    blogs: [
      {
        slug: "plan-the-perfect-stay",
        title: "How to Plan the Perfect Stay",
        excerpt: "A little planning turns a good trip into a great one. Here's how to make the most of every stay.",
        minutes: 3,
        cover: "1571896349842-33c89424de2d",
        body: [
          "The best trips feel effortless — and that's usually the result of a few smart choices made before you arrive. Start with location: staying close to what you came for saves hours you'd rather spend enjoying yourself.",
          "Book directly for the best rates and perks, tell the hotel your arrival time, ask about local recommendations, and mention any special occasion — most hotels love to help make it memorable. A quick message ahead of time goes a long way.",
          "At {business}, our team is happy to arrange the details before you arrive, from early check-in to dinner reservations. Just reach out — making your stay effortless is what we do best.",
        ],
      },
      {
        slug: "choosing-the-right-event-venue",
        title: "Choosing the Right Venue for Your Event",
        excerpt: "From weddings to conferences, the venue sets the tone. Here's what to look for.",
        minutes: 4,
        cover: "1540541338287-41700207dee6",
        body: [
          "The venue is the single biggest decision for any event — it shapes the atmosphere, the logistics, and often the budget. Before you book, get clear on your guest count, your date flexibility, and the experience you want your guests to have.",
          "Then evaluate: capacity and layout, catering quality, parking and accessibility, on-site coordination, and how flexible the team is with your vision. A venue that handles the details lets you actually enjoy your own event.",
          "At {business}, our events team has hosted celebrations of every size. We'll walk you through the space, the menu, and the plan — book a visit and see it for yourself.",
        ],
      },
    ],
  },
  gym: {
    primary: "#ea580c", primaryD: "#c2410c", accent: "#84cc16",
    hero: "1534438327276-14e5300c3a48",
    gallery: ["1571019613454-1cb2f99b2d8b", "1534258936925-c58bed479fcb", "1517836357463-d25dfeac3438"],
    kicker: "Train Harder. Feel Better.",
    tagline: "Your goals, our mission — let's get you there.",
    bookLabel: "free trial",
    chips: ["Book a free trial", "Your timings?", "Do you offer personal training?"],
    services: [
      ["🏋️", "Strength Training", "Expert-guided workouts to build real strength."],
      ["🔥", "HIIT & Cardio", "High-energy sessions that burn and build."],
      ["🧘", "Yoga & Mobility", "Balance, flexibility and recovery."],
      ["🥗", "Nutrition Coaching", "Fuel your progress with a real plan."],
      ["👥", "Personal Training", "One-on-one coaching tailored to you."],
      ["💪", "Group Classes", "Train together, stay motivated."],
    ],
    why: [
      ["🏅", "Certified trainers", "Real coaches who care about results."],
      ["🕕", "Open early & late", "Fits around your schedule, not ours."],
      ["🧼", "Clean equipment", "Modern gear, always maintained."],
      ["🎯", "Real results", "Plans built around your goals."],
    ],
    testimonials: [
      ["Lost 8kg in three months with their trainers. Best decision I've made.", "Aditya P."],
      ["Amazing energy, clean equipment and coaches who actually push you.", "Meera J."],
    ],
    blogs: [
      {
        slug: "start-your-fitness-journey",
        title: "How to Start Your Fitness Journey (and Stick to It)",
        excerpt: "Motivation gets you started; systems keep you going. Here's how to build habits that last.",
        minutes: 4,
        cover: "1571019613454-1cb2f99b2d8b",
        body: [
          "The hardest part of getting fit isn't the workout — it's showing up consistently. The people who succeed aren't the most motivated; they're the ones who make training easy to repeat. Start smaller than you think you should.",
          "Pick a schedule you can actually keep (three days beats seven days you'll skip), set one clear goal, track your progress, and find a workout you genuinely enjoy. Motivation fades — but a routine and a bit of accountability carry you through the days you don't feel like it.",
          "At {business}, our coaches help you build that routine from day one, with a plan matched to your level. Book a free trial and take the first step — we'll handle the rest.",
        ],
      },
      {
        slug: "nutrition-basics-that-work",
        title: "Nutrition Basics That Actually Work",
        excerpt: "Forget fad diets. These simple, sustainable principles do the heavy lifting.",
        minutes: 3,
        cover: "1534258936925-c58bed479fcb",
        body: [
          "You can't out-train a poor diet — but you also don't need a complicated one. The fundamentals of good nutrition are simple, and they work far better than any trending plan because you can actually stick to them.",
          "Focus on four things: enough protein to support your training, plenty of vegetables and fruit, sensible portions, and staying hydrated. You don't have to give up the foods you love — you just need balance and consistency over perfection.",
          "The coaches at {business} offer nutrition guidance alongside your training, so your effort in the gym actually shows. Ask us about a plan built around your goals.",
        ],
      },
    ],
  },
  generic: {
    primary: "#0d7d74", primaryD: "#0a5f58", accent: "#f4b740",
    hero: "1497366216548-37526070297c",
    gallery: ["1600880292203-757bb62b4baf", "1600585154340-be6161a56a0c", "1497366216548-37526070297c"],
    kicker: "Quality You Can Trust",
    tagline: "Service and care your customers can count on.",
    bookLabel: "appointment",
    chips: ["Book now", "Your timings?", "Where are you located?"],
    services: [
      ["✦", "Our Services", "A full range of offerings tailored to your needs."],
      ["👥", "Expert Team", "Skilled professionals dedicated to quality."],
      ["📍", "Trusted Locally", "A reputation built on happy customers."],
      ["💳", "Fair Pricing", "Transparent, honest value every time."],
      ["📱", "Easy Booking", "Reach us in a tap and get seen quickly."],
      ["💬", "Great Support", "We're here whenever you need us."],
    ],
    why: [
      ["🏆", "Trusted locally", "A name your neighbours recommend."],
      ["⚡", "Quick service", "Fast, friendly and reliable."],
      ["🤝", "Customer-first", "Your satisfaction is our priority."],
      ["📅", "Easy to reach", "Book or call in seconds."],
    ],
    testimonials: [
      ["Fantastic service and lovely people. Couldn't ask for more.", "A happy customer"],
      ["Reliable, professional and always friendly. Highly recommend.", "Local regular"],
    ],
    blogs: [
      {
        slug: "why-customers-trust-local",
        title: "Why Customers Trust Local Businesses",
        excerpt: "In an age of big brands, local businesses still win on the things that matter most.",
        minutes: 3,
        cover: "1600880292203-757bb62b4baf",
        body: [
          "People increasingly choose local businesses over faceless chains — and it's not just sentiment. Local businesses tend to offer more personal service, genuine accountability, and a real stake in the community they serve.",
          "That trust is earned through consistency: showing up, doing good work, and treating every customer like a neighbour rather than a transaction. Online reviews have made this reputation visible — and more valuable than ever.",
          "At {business}, that relationship is the whole point. We're not trying to serve everyone everywhere; we're trying to be the business our customers recommend to their friends.",
        ],
      },
      {
        slug: "what-great-service-looks-like",
        title: "What Great Customer Service Looks Like",
        excerpt: "Great service isn't complicated — it's a handful of simple things done consistently.",
        minutes: 3,
        cover: "1497366216548-37526070297c",
        body: [
          "Ask anyone about a business they love, and they'll rarely mention price first — they'll talk about how they were treated. Great service is the strongest form of marketing there is, because it turns customers into advocates.",
          "It comes down to a few basics: respond quickly, listen properly, do what you promised, and fix problems without fuss. None of it is complicated — but doing it every single time is what sets the best businesses apart.",
          "That standard is what {business} is built on. Every interaction is a chance to earn your trust, and we don't take that lightly.",
        ],
      },
    ],
  },
};

export function theme(kind: Kind): Theme {
  return THEMES[kind];
}

/* Shared CSS for the preview site + demo blog. */
export const PREVIEW_CSS = `
.pv-root{--pv-ink:#16231f;--pv-muted:#5c6b66;--pv-bg:#fff;--pv-soft:#f4f8f7;--pv-line:#e6edeb;background:var(--pv-bg);color:var(--pv-ink);font-family:var(--font-sans,system-ui,sans-serif);min-height:100vh;line-height:1.6}
.pv-root *{box-sizing:border-box}
.pv-wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.pv-ribbon{background:linear-gradient(90deg,var(--pv-primary-d),var(--pv-primary));color:#fff;font-size:13.5px;text-align:center;padding:9px 16px}
.pv-ribbon a{color:#fff;font-weight:800;text-decoration:underline;text-underline-offset:2px}
.pv-header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--pv-line)}
.pv-headin{display:flex;align-items:center;gap:14px;padding:13px 22px;max-width:1120px;margin:0 auto}
.pv-logo{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--pv-primary),var(--pv-primary-d));color:#fff;display:grid;place-items:center;font-weight:800;font-size:20px;flex:none;text-decoration:none}
.pv-bname{font-weight:800;font-size:18px;letter-spacing:-.01em;text-decoration:none;color:inherit}
.pv-nav{margin-left:auto;display:flex;gap:24px;align-items:center}
.pv-nav a{color:var(--pv-muted);text-decoration:none;font-weight:600;font-size:14.5px}
.pv-nav a:hover{color:var(--pv-ink)}
.pv-nav-call{color:var(--pv-primary)!important}
.pv-btn{background:var(--pv-primary);color:#fff;border:0;border-radius:40px;padding:11px 22px;font-weight:800;font-size:14.5px;text-decoration:none;display:inline-block;cursor:pointer;white-space:nowrap;transition:.15s}
.pv-btn:hover{background:var(--pv-primary-d);transform:translateY(-1px)}
.pv-btn-lg{padding:15px 30px;font-size:16px;border-radius:44px}
.pv-btn-ghost{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.65);backdrop-filter:blur(4px)}
.pv-btn-ghost:hover{background:rgba(255,255,255,.2)}
@media(max-width:820px){.pv-nav a:not(.pv-btn){display:none}}
.pv-hero{position:relative;background-size:cover;background-position:center;color:#fff;padding:120px 0 96px;overflow:hidden}
.pv-hero-overlay{position:absolute;inset:0;background:linear-gradient(120deg,rgba(8,16,14,.82),rgba(8,16,14,.45) 60%,rgba(8,16,14,.25))}
.pv-hero-in{position:relative}
.pv-kicker{display:inline-block;background:var(--pv-accent);color:#231a00;font-weight:800;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:40px;margin-bottom:18px}
.pv-hero h1{font-family:var(--font-display,Georgia,serif);font-size:clamp(38px,6vw,66px);line-height:1.04;margin:0 0 16px;letter-spacing:-.02em;text-shadow:0 2px 30px rgba(0,0,0,.3)}
.pv-lead{font-size:clamp(17px,2.3vw,23px);max-width:620px;margin:0 0 26px;color:#eef4f2}
.pv-badges{display:flex;flex-wrap:wrap;gap:12px;margin:0 0 30px;align-items:center}
.pv-rate{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.95);color:var(--pv-ink);border-radius:40px;padding:9px 18px;font-weight:600;font-size:15px}
.pv-rate b{font-weight:800}
.pv-rate .pv-stars{color:var(--pv-accent);letter-spacing:2px;font-size:16px}
.pv-star-empty{opacity:.35}
.pv-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:40px;padding:9px 16px;font-weight:600;font-size:14px}
.pv-heroctas{display:flex;gap:13px;flex-wrap:wrap}
.pv-trust{background:var(--pv-primary-d);color:#fff}
.pv-trust-in{display:flex;flex-wrap:wrap;gap:14px 40px;justify-content:center;padding:18px 22px;font-size:15px}
.pv-trust b{color:var(--pv-accent);font-weight:800}
.pv-sec{padding:70px 0}
.pv-eyebrow{color:var(--pv-primary);font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.pv-sec h2{font-family:var(--font-display,Georgia,serif);font-size:clamp(28px,3.6vw,40px);margin:0 0 10px;letter-spacing:-.01em}
.pv-sub{color:var(--pv-muted);max-width:640px;margin:0 0 38px;font-size:16.5px}
.pv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:860px){.pv-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.pv-grid{grid-template-columns:1fr}}
.pv-card{background:#fff;border:1px solid var(--pv-line);border-radius:18px;padding:26px 24px;transition:.18s}
.pv-card:hover{box-shadow:0 18px 40px rgba(16,80,72,.12);transform:translateY(-4px);border-color:transparent}
.pv-ic{width:52px;height:52px;border-radius:14px;background:var(--pv-soft);display:grid;place-items:center;font-size:26px;margin-bottom:15px}
.pv-card h3{margin:0 0 7px;font-size:18px}
.pv-card p{margin:0;color:var(--pv-muted);font-size:14.5px}
.pv-gallery-sec{background:var(--pv-soft)}
.pv-gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:200px 200px;gap:14px}
.pv-gitem{border-radius:16px;background-size:cover;background-position:center;box-shadow:0 8px 24px rgba(0,0,0,.08)}
.pv-gitem[data-i="0"]{grid-row:1/3}
@media(max-width:700px){.pv-gallery{grid-template-columns:1fr 1fr;grid-template-rows:160px 160px}.pv-gitem[data-i="0"]{grid-row:auto;grid-column:1/3}}
.pv-why{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:700px){.pv-why{grid-template-columns:1fr}}
.pv-whycard{display:flex;gap:16px;background:#fff;border:1px solid var(--pv-line);border-radius:16px;padding:22px}
.pv-whyic{width:48px;height:48px;flex:none;border-radius:12px;background:var(--pv-soft);display:grid;place-items:center;font-size:24px}
.pv-whycard h4{margin:0 0 4px;font-size:17px}
.pv-whycard p{margin:0;color:var(--pv-muted);font-size:14.5px}
.pv-about{background:var(--pv-soft)}
.pv-about-in{display:grid;grid-template-columns:1fr 1.1fr;gap:44px;align-items:center}
@media(max-width:820px){.pv-about-in{grid-template-columns:1fr;gap:28px}}
.pv-about-img{min-height:340px;border-radius:20px;background-size:cover;background-position:center;box-shadow:0 20px 50px rgba(0,0,0,.14)}
.pv-about-txt p{color:var(--pv-muted);font-size:16.5px}
.pv-stats{display:flex;flex-wrap:wrap;gap:34px;margin-top:26px}
.pv-stat .n{font-family:var(--font-display,Georgia,serif);font-size:34px;font-weight:800;color:var(--pv-primary);line-height:1}
.pv-stat .l{color:var(--pv-muted);font-size:13.5px;margin-top:4px}
.pv-tgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:700px){.pv-tgrid{grid-template-columns:1fr}}
.pv-quote{margin:0;background:#fff;border:1px solid var(--pv-line);border-radius:18px;padding:28px 26px}
.pv-qstars{color:var(--pv-accent);letter-spacing:2px;font-size:17px;margin-bottom:10px}
.pv-quote blockquote{margin:0 0 12px;font-size:17px;line-height:1.55}
.pv-quote figcaption{color:var(--pv-muted);font-weight:700;font-size:14.5px}
.pv-cta-band{background:linear-gradient(120deg,var(--pv-primary),var(--pv-primary-d));color:#fff;padding:64px 0;text-align:center}
.pv-cta-in h2{font-family:var(--font-display,Georgia,serif);font-size:clamp(26px,3.6vw,40px);margin:0 0 8px}
.pv-cta-in p{margin:0 0 24px;font-size:17px;opacity:.92}
.pv-cta-in .pv-heroctas{justify-content:center}
.pv-btn-on-dark{background:#fff;color:var(--pv-primary-d)}
.pv-btn-on-dark:hover{background:#fff;opacity:.92}
.pv-btn-ghost-dark{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.6)}
.pv-contact{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:start}
@media(max-width:760px){.pv-contact{grid-template-columns:1fr}}
.pv-info{list-style:none;padding:0;margin:0 0 22px}
.pv-info li{display:flex;gap:12px;padding:12px 0;border-bottom:1px dashed var(--pv-line);font-size:15.5px}
.pv-info li b{color:var(--pv-primary);min-width:52px}
.pv-info a{color:inherit}
.pv-map{min-height:240px;border-radius:18px;border:1px solid var(--pv-line);background:radial-gradient(600px 220px at 30% 0%,var(--pv-soft),#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none;color:var(--pv-ink);padding:32px 22px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.06)}
.pv-map:hover{border-color:var(--pv-primary)}
.pv-map-pin{font-size:36px}
.pv-map-name{font-weight:800;font-size:17px}
.pv-map-addr{color:var(--pv-muted);font-size:14px;max-width:320px}
.pv-map-link{margin-top:6px;color:var(--pv-primary);font-weight:800;font-size:14.5px}
.pv-footer{background:#0c1512;color:#cfe0db;padding:40px 0;text-align:center}
.pv-footer .fb{font-weight:800;color:#fff;font-size:18px}
.pv-footer .fm{color:#8fb0a8;font-size:13.5px;margin-top:8px}
.pv-footer a{color:#eafaf6}
.pv-blog{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:700px){.pv-blog{grid-template-columns:1fr}}
.pv-bcard{display:block;text-decoration:none;color:inherit;background:#fff;border:1px solid var(--pv-line);border-radius:18px;overflow:hidden;transition:.18s}
.pv-bcard:hover{box-shadow:0 18px 40px rgba(16,80,72,.12);transform:translateY(-4px)}
.pv-bcover{height:180px;background-size:cover;background-position:center}
.pv-bbody{padding:22px 22px 24px}
.pv-bmeta{color:var(--pv-primary);font-weight:800;font-size:12.5px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
.pv-bcard h3{margin:0 0 8px;font-size:19px}
.pv-bcard p{margin:0;color:var(--pv-muted);font-size:14.5px}
.pv-article{max-width:760px;margin:0 auto;padding:52px 22px 72px}
.pv-artback{display:inline-block;margin-bottom:22px;color:var(--pv-primary);font-weight:800;text-decoration:none;font-size:14.5px}
.pv-artcover{height:320px;border-radius:20px;background-size:cover;background-position:center;margin:0 0 32px;box-shadow:0 20px 50px rgba(0,0,0,.14)}
.pv-article h1{font-family:var(--font-display,Georgia,serif);font-size:clamp(30px,4.5vw,46px);line-height:1.1;letter-spacing:-.02em;margin:0 0 12px}
.pv-artmeta{color:var(--pv-muted);font-size:14.5px;margin:0 0 30px}
.pv-article p{font-size:17.5px;line-height:1.78;color:#2a3a35;margin:0 0 22px}
.pv-artcta{margin-top:40px;background:var(--pv-soft);border:1px solid var(--pv-line);border-radius:18px;padding:28px;text-align:center}
.pv-artcta h3{margin:0 0 8px;font-size:20px}
.pv-artcta p{margin:0 0 16px;font-size:15.5px;color:var(--pv-muted)}
.pv-notfound{min-height:100vh;display:grid;place-items:center;background:#f4f8f7;text-align:center;padding:24px;color:#16231f}
.pv-notfound h1{font-size:26px;margin:0 0 8px}.pv-notfound p{color:#5c6b66;margin:0 0 18px}
.pv-cta{background:#0d7d74;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-weight:800}
`;
