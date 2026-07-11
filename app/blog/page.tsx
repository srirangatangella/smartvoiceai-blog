import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import BlogHero from "@/components/BlogHero";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Blog | Smart Voice AI",
  description:
    "Insights, guides, and tutorials on building next-generation conversational AI Voice Agents and automating business operations.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogLandingPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const posts = getAllPosts();
  const categories = getAllCategories();

  // Pagination setup (6 posts per page)
  const postsPerPage = 6;
  const currentPage = Number(resolvedParams.page) || 1;
  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = featuredPost
    ? posts.filter((p) => p.slug !== featuredPost.slug)
    : posts;

  // Paginated chunk
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = regularPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <>
      <div className="glow-bg"></div>

      <SiteNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <BlogHero />

        {/* Client-side Search (Fuse.js) */}
        <SearchBar posts={posts} />

        {/* Categories list */}
        <CategoryPills categories={categories} />

        {/* Featured Post (only on page 1) */}
        {currentPage === 1 && featuredPost && (
          <div className="mb-16">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-primary mb-4 select-none">
              Featured Post
            </h3>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="my-12">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-8 select-none">
            {currentPage === 1 ? "Latest Articles" : `All Articles - Page ${currentPage}`}
          </h3>

          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-gray-400">No articles found.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-12">
            <Link
              href={currentPage > 2 ? `/blog?page=${currentPage - 1}` : "/blog"}
              className={`px-4 py-2 border border-white/10 rounded-lg text-sm transition-all select-none ${
                currentPage === 1
                  ? "opacity-50 pointer-events-none text-gray-600 border-white/5"
                  : "text-white hover:border-primary hover:text-primary"
              }`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-400 select-none">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className={`px-4 py-2 border border-white/10 rounded-lg text-sm transition-all select-none ${
                currentPage >= totalPages
                  ? "opacity-50 pointer-events-none text-gray-600 border-white/5"
                  : "text-white hover:border-primary hover:text-primary"
              }`}
            >
              Next
            </Link>
          </div>
        )}

        <Newsletter />
      </div>

      <SiteFooter />
    </>
  );
}
