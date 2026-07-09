import React from "react";
import Link from "next/link";
import { Mic, Mail, ArrowLeft } from "lucide-react";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import BlogHero from "@/components/BlogHero";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";

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

      {/* Nav */}
      <nav className="border-b border-white/5">
        <Link href="/" className="nav-logo">
          <Mic className="h-6 w-6 text-primary" />
          <span>
            SMART VOICE <span className="text-primary font-extrabold">AI</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/#services">Services</Link>
          <Link href="/#demo">Live Demo</Link>
          <Link href="/blog" className="text-white">
            Blog
          </Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <div className="nav-cta hidden md:flex">
          <Link href="/demo?client=apas" className="btn btn-outline py-2 px-5">
            Live Demo
          </Link>
          <Link href="/#contact" className="btn btn-primary py-2 px-5">
            Partner With Us
          </Link>
        </div>
      </nav>

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

      {/* Footer */}
      <footer>
        <div className="footer-logo">SMART VOICE AI</div>
        <p className="footer-contact">
          <a href="mailto:contact@smartvoiceai.in">
            <Mail className="h-4 w-4" /> Email Us
          </a>{" "}
          |
          <a
            href="https://wa.me/916303919752"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="h-4 w-4 fill-current align-middle"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.782.001-2.592-1.01-5.03-2.847-6.87C16.399 2.1 13.962 1.085 12.01 1.085c-5.405 0-9.809 4.384-9.813 9.784-.002 2.033.528 4.022 1.536 5.766l-.974 3.557 3.639-.954zm10.902-7.305c-.292-.146-1.727-.853-1.993-.95-.266-.098-.46-.146-.653.146-.193.293-.748.95-.916 1.142-.169.193-.337.217-.629.071-.29-.146-1.228-.452-2.339-1.444-.864-.771-1.448-1.724-1.618-2.016-.17-.293-.018-.451.129-.595.132-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.048-.365-.024-.51-.073-.146-.653-1.573-.895-2.157-.235-.568-.475-.49-.653-.499-.169-.008-.363-.01-.557-.01-.195 0-.51.073-.777.365-.266.293-1.016.993-1.016 2.42 0 1.427 1.039 2.805 1.184 3.001.146.195 2.046 3.125 4.957 4.381.693.3 1.233.478 1.655.612.697.22 1.332.19 1.834.115.56-.083 1.727-.706 1.972-1.389.245-.683.245-1.267.172-1.389-.073-.12-.266-.195-.558-.341z" />
            </svg>{" "}
            WhatsApp Us
          </a>
        </p>
        <p className="mt-5 text-gray-500">
          &copy; 2026 Smart Voice AI. All rights reserved.
        </p>
      </footer>
    </>
  );
}
