import RSS from "rss";
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://smarvoiceai.in";

  const feed = new RSS({
    title: "Smart Voice AI Blog",
    description: "Latest news, tutorials, and guides on AI voice agents, automation, and conversational AI.",
    feed_url: `${baseUrl}/blog/rss.xml`,
    site_url: baseUrl,
    managingEditor: "contact@smartvoiceai.in (Smart Voice AI)",
    webMaster: "contact@smartvoiceai.in (Smart Voice AI)",
    copyright: `${new Date().getFullYear()} Smart Voice AI`,
    language: "en",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      categories: [post.category, ...post.tags],
      author: post.author,
      date: post.date,
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
