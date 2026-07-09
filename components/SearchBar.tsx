"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock } from "lucide-react";
import Link from "next/link";
import Fuse from "fuse.js";
import { PostData } from "@/lib/posts";

interface SearchBarProps {
  posts: PostData[];
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PostData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up Fuse.js for querying multiple fields
  const fuse = new Fuse(posts, {
    keys: ["title", "description", "content", "tags", "category"],
    threshold: 0.35,
  });

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query).map((r) => r.item);
    setResults(searchResults.slice(0, 5)); // cap at 5 results
  }, [query]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative max-w-md mx-auto my-6 px-4 z-40" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search articles, tags, categories..."
          className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-primary text-white placeholder-gray-500 text-sm transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query && (
        <div className="absolute left-4 right-4 mt-2 bg-[#0c0c12] border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden max-h-80 overflow-y-auto z-50 animate-fade-in">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors pointer-events-auto"
                >
                  <div className="text-[10px] text-primary uppercase font-bold tracking-wider mb-0.5">
                    {post.category}
                  </div>
                  <div className="text-sm font-semibold text-white line-clamp-1">
                    {post.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-sm text-gray-400 select-none">
              No matching articles found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
