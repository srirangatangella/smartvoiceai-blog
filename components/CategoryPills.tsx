import React from "react";
import Link from "next/link";
import { CategoryInfo } from "@/lib/posts";

interface CategoryPillsProps {
  categories: CategoryInfo[];
  activeCategorySlug?: string;
}

export default function CategoryPills({
  categories,
  activeCategorySlug,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-8 px-4 select-none">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
          !activeCategorySlug
            ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,212,255,0.25)]"
            : "bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white"
        }`}
      >
        All Articles
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/blog/category/${cat.slug}`}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-1.5 ${
            activeCategorySlug === cat.slug
              ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,212,255,0.25)]"
              : "bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          {cat.name}
          <span
            className={`text-[9px] rounded-full px-1.5 py-0.5 ${
              activeCategorySlug === cat.slug
                ? "bg-black/15 text-black/80 font-bold"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {cat.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
