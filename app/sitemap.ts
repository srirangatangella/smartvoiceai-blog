import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/solutions/inbound-voice-agents", changeFrequency: "monthly", priority: 0.9 },
    { path: "/solutions/outbound-voice-agents", changeFrequency: "monthly", priority: 0.9 },
    { path: "/solutions/website-voice-assistant", changeFrequency: "monthly", priority: 0.9 },
    { path: "/industries/real-estate", changeFrequency: "monthly", priority: 0.9 },
    { path: "/industries/healthcare", changeFrequency: "monthly", priority: 0.9 },
    { path: "/integrations", changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/demo", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  ];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedDate ? new Date(post.updatedDate) : new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...postPages];
}
