import React from "react";

export default function BlogHero() {
  return (
    <div className="text-center py-16 md:py-24 max-w-4xl mx-auto relative px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
        Smart Voice AI <span className="gradient-text font-extrabold">Blog</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Insights, guides, and tutorials on building next-generation conversational AI Voice Agents and automating business operations.
      </p>
    </div>
  );
}
