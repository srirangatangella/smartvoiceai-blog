import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";

const postsDirectory = path.join(process.cwd(), "content");

export interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  draft: boolean;
  readingTime: string;
  content: string;
  contentHtml?: string;
}

// Recursively find all markdown files in a directory
function getMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Calculate reading time based on word count
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const cleanContent = content.replace(/[#*`_\[\]()\-]/g, ""); // Strip markdown characters
  const words = cleanContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all posts sorted by date (newest first)
export function getAllPosts(): PostData[] {
  const files = getMarkdownFiles(postsDirectory);
  const allPostsData = files.map((filePath) => {
    // Slug is the filename without extension
    const slug = path.basename(filePath, ".md");

    // Read markdown file
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse metadata with gray-matter
    const { data, content } = matter(fileContents);

    const readingTime = calculateReadingTime(content);

    // Ensure tags are an array
    let tags: string[] = [];
    if (data.tags) {
      tags = Array.isArray(data.tags)
        ? data.tags.map((t: string) => t.trim())
        : data.tags.split(",").map((t: string) => t.trim());
    }

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      updatedDate: data.updatedDate ? new Date(data.updatedDate).toISOString().split("T")[0] : undefined,
      author: data.author || "Smart Voice AI",
      category: data.category || "General",
      tags,
      image: data.image || "/images/placeholder.jpg",
      featured: !!data.featured,
      draft: !!data.draft,
      readingTime,
      content,
    };
  });

  // Filter out drafts & sort by date
  return allPostsData
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get a single post and render its markdown to HTML
export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const posts = getAllPosts();
  let matchedPost = posts.find((p) => p.slug === slug);

  if (!matchedPost) {
    // If not found in dynamic loaded posts, search files directly
    const files = getMarkdownFiles(postsDirectory);
    const matchedFilePath = files.find((f) => path.basename(f, ".md") === slug);

    if (!matchedFilePath) return null;

    const fileContents = fs.readFileSync(matchedFilePath, "utf8");
    const { data, content } = matter(fileContents);
    const readingTime = calculateReadingTime(content);

    let tags: string[] = [];
    if (data.tags) {
      tags = Array.isArray(data.tags)
        ? data.tags.map((t: string) => t.trim())
        : data.tags.split(",").map((t: string) => t.trim());
    }

    matchedPost = {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      updatedDate: data.updatedDate ? new Date(data.updatedDate).toISOString().split("T")[0] : undefined,
      author: data.author || "Smart Voice AI",
      category: data.category || "General",
      tags,
      image: data.image || "/images/placeholder.jpg",
      featured: !!data.featured,
      draft: !!data.draft,
      readingTime,
      content,
    } as any;
  }

  if (!matchedPost) return null;

  // Process Markdown to HTML
  const rawProcessed = await remark().use(html).process(matchedPost.content);
  const rawHtml = rawProcessed.toString();

  // Highlight syntax with rehype
  const highlightedProcessed = await rehype()
    .use(rehypeHighlight)
    .process(rawHtml);
  const contentHtml = highlightedProcessed.toString();

  return {
    ...matchedPost,
    contentHtml,
  };
}

// Get all unique categories (URL slugified as well as human name)
export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const categoryCounts: Record<string, number> = {};

  posts.forEach((post) => {
    const category = post.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return Object.keys(categoryCounts).map((name) => ({
    name,
    slug: slugify(name),
    count: categoryCounts[name],
  }));
}

// Get all unique tags
export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.keys(tagCounts).map((name) => ({
    name,
    slug: slugify(name),
    count: tagCounts[name],
  }));
}

// Helper to slugify a string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Get posts by category slug
export function getPostsByCategory(categorySlug: string): PostData[] {
  const posts = getAllPosts();
  return posts.filter((post) => slugify(post.category) === categorySlug);
}

// Get posts by tag slug
export function getPostsByTag(tagSlug: string): PostData[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.some((t) => slugify(t) === tagSlug));
}

// Get related articles
export function getRelatedPosts(currentPost: PostData, limit = 3): PostData[] {
  const posts = getAllPosts();

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      let score = 0;
      // Boost if same category
      if (post.category === currentPost.category) score += 3;
      // Boost for each matching tag
      const matchingTags = post.tags.filter((t) => currentPost.tags.includes(t));
      score += matchingTags.length * 2;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
