import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mic, Mail, Clock, Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/posts";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import Newsletter from "@/components/Newsletter";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found | Smart Voice AI Blog",
    };
  }

  const baseUrl = "https://smarvoiceai.in";
  return {
    title: `${post.title} | Smart Voice AI`,
    description: post.description,
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${resolvedParams.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length; // 2 or 3
    const rawText = match[2].trim();
    // Strip markdown formatting if any in the heading text
    const text = rawText.replace(/[#*`_\[\]()\-]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}

// Inject IDs into HTML heading elements
const injectHeadingIds = (html: string) => {
  return html.replace(/<(h[23])>(.*?)<\/h[23]>/g, (match, tag, text) => {
    const cleanText = text.replace(/<[^>]*>/g, ""); // Strip internal tags
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `<${tag} id="${id}">${text}</${tag}>`;
  });
};

export default async function BlogPostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post || post.draft) {
    notFound();
  }

  const posts = getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);

  // Next post (newer) and Previous post (older)
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const relatedPosts = getRelatedPosts(post, 3);
  const headings = extractHeadings(post.content);
  const contentHtmlWithIds = post.contentHtml ? injectHeadingIds(post.contentHtml) : "";

  const postUrl = `https://smarvoiceai.in/blog/${post.slug}`;

  // JSON-LD structured data for article SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://smarvoiceai.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Smart Voice AI",
      logo: {
        "@type": "ImageObject",
        url: "https://smarvoiceai.in/logo.png", // Fallback URL
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

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

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>

        {/* Hero header */}
        <article className="relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
              <Link
                href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1 hover:bg-primary/20 transition-all"
              >
                {post.category}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{post.readingTime}</span>
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              {post.description}
            </p>

            <div className="flex items-center justify-center gap-4 pb-8 border-b border-white/15">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{post.author}</div>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>Published: {post.date}</span>
                  {post.updatedDate && <span>• Updated: {post.updatedDate}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="max-w-5xl w-full mx-auto rounded-3xl overflow-hidden aspect-[21/9] border border-white/10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article layout with side TOC */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-5xl mx-auto items-start">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <aside className="lg:col-span-1 hidden lg:sticky lg:top-28 lg:block border border-white/10 rounded-2xl p-6 bg-[#0c0c12]">
                <h5 className="font-serif font-bold text-base text-white mb-4 select-none">
                  Table of Contents
                </h5>
                <nav className="space-y-3">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-xs leading-relaxed transition-colors hover:text-primary ${
                        h.level === 3 ? "pl-3 text-gray-500" : "text-gray-400 font-semibold"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}

            {/* Content body */}
            <div className={`lg:col-span-3 ${headings.length === 0 ? "lg:col-start-1" : ""}`}>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: contentHtmlWithIds }}
              />

              {/* Tags and sharing */}
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center py-8 mt-12 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-xs bg-white/5 border border-white/10 hover:border-primary hover:text-primary text-gray-400 rounded-lg px-2.5 py-1 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Prev / Next buttons */}
              {(prevPost || nextPost) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      className="p-5 border border-white/10 rounded-2xl hover:border-primary hover:bg-[#0c0c12] text-left transition-all group flex flex-col pointer-events-auto"
                    >
                      <span className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1 select-none">
                        <ArrowLeft className="h-3 w-3" /> Previous Article
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-primary line-clamp-1">
                        {prevPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      className="p-5 border border-white/10 rounded-2xl hover:border-primary hover:bg-[#0c0c12] text-right transition-all group flex flex-col pointer-events-auto"
                    >
                      <span className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1 justify-end select-none">
                        Next Article <ArrowRight className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-primary line-clamp-1">
                        {nextPost.title}
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />

        {/* Newsletter CTA */}
        <Newsletter />
      </main>

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
