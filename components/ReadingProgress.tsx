"use client";

import React, { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);
    return () => {
      window.removeEventListener("scroll", updateScrollCompletion);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-[9999] pointer-events-none">
      <div
        className="h-full bg-primary transition-all duration-75 ease-out shadow-[0_0_8px_var(--primary)]"
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );
}
