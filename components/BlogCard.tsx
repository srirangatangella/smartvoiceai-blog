import React from "react";
import Link from "next/link";
import { User, Clock, ArrowRight } from "lucide-react";
import { PostData } from "@/lib/posts";

interface BlogCardProps {
  post: PostData;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const postUrl = `/blog/${post.slug}`;

  if (featured) {
    return (
      <div className="bg-[#0c0c12] border border-white/10 rounded-3xl overflow-hidden hover:border-primary transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        <Link href={postUrl} className="relative aspect-[16/10] lg:aspect-auto overflow-hidden group min-h-[300px] block w-full">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent lg:hidden" />
        </Link>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap gap-4 items-center mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{post.readingTime}</span>
            </div>
          </div>
          <Link href={postUrl}>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 hover:text-primary transition-colors leading-[1.2]">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-400 mb-6 text-base md:text-lg line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{post.author}</div>
                <div className="text-xs text-gray-500">{post.date}</div>
              </div>
            </div>
            <Link href={postUrl} className="text-primary hover:text-white flex items-center gap-1 font-semibold group pointer-events-auto">
              Read Article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c12] border border-white/10 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 flex flex-col group h-full">
      <Link href={postUrl} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            {post.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{post.readingTime}</span>
          </div>
        </div>
        <Link href={postUrl} className="block">
          <h3 className="font-serif text-xl font-bold mb-3 hover:text-primary transition-colors leading-[1.3] line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>{post.author}</span>
          </div>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
      </div>
    </div>
  );
}
