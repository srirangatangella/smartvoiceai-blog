import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/posts";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

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

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${resolvedParams.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${resolvedParams.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
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

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      {/* Dynamic SEO JSON-LD: Article + Breadcrumb */}
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            updatedDate: post.updatedDate,
            author: post.author,
            image: post.image,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      <div className="glow-bg"></div>

      <SiteNav />

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

      <SiteFooter />
    </>
  );
}
