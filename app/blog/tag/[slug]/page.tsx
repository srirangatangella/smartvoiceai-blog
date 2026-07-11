import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const resolvedParams = await params;
  const tags = getAllTags();
  const matchedTag = tags.find((t) => t.slug === resolvedParams.slug);

  if (!matchedTag) {
    return {
      title: "Tag Not Found | Smart Voice AI Blog",
    };
  }

  return {
    title: `Articles tagged with "${matchedTag.name}" | Smart Voice AI`,
    description: `Read all articles tagged with "${matchedTag.name}" on the Smart Voice AI blog.`,
    alternates: {
      canonical: `/blog/tag/${resolvedParams.slug}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const posts = getPostsByTag(resolvedParams.slug);
  const tags = getAllTags();
  const matchedTag = tags.find((t) => t.slug === resolvedParams.slug);

  if (!matchedTag) {
    notFound();
  }

  return (
    <>
      <div className="glow-bg"></div>

      <SiteNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>

        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Tag: <span className="gradient-text font-extrabold">#{matchedTag.name}</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Regular Posts Grid */}
        <div className="my-12">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-gray-400">No articles found with this tag.</p>
            </div>
          )}
        </div>

        <Newsletter />
      </div>

      <SiteFooter />
    </>
  );
}
