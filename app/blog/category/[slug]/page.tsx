import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";
import CategoryPills from "@/components/CategoryPills";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categories = getAllCategories();
  const matchedCategory = categories.find((c) => c.slug === resolvedParams.slug);

  if (!matchedCategory) {
    return {
      title: "Category Not Found | Smart Voice AI Blog",
    };
  }

  return {
    title: `${matchedCategory.name} Articles | Smart Voice AI`,
    description: `Read all articles about ${matchedCategory.name} on the Smart Voice AI blog.`,
    alternates: {
      canonical: `/blog/category/${resolvedParams.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const posts = getPostsByCategory(resolvedParams.slug);
  const categories = getAllCategories();
  const matchedCategory = categories.find((c) => c.slug === resolvedParams.slug);

  if (!matchedCategory) {
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
            Category: <span className="gradient-text font-extrabold">{matchedCategory.name}</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Categories Pills */}
        <CategoryPills categories={categories} activeCategorySlug={resolvedParams.slug} />

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
              <p className="text-gray-400">No articles found in this category.</p>
            </div>
          )}
        </div>

        <Newsletter />
      </div>

      <SiteFooter />
    </>
  );
}
