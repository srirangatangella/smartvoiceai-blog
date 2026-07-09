import React from "react";
import BlogCard from "./BlogCard";
import { PostData } from "@/lib/posts";

interface RelatedPostsProps {
  posts: PostData[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="my-16 pt-12 border-t border-white/10">
      <h4 className="font-serif text-2xl font-bold mb-8">Related Articles</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
