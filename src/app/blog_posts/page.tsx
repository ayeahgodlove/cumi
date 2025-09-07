import { Metadata } from "next";
import BlogPostsPageComponent from "@components/page-components/blog-posts-page.component";

export const metadata: Metadata = {
  title: "Blog Posts - Cumi Digital Insights",
  description: "Read our latest blog posts about web development, technology trends, digital innovation, and industry insights from the Cumi team.",
  keywords: ["blog posts", "web development blog", "technology insights", "digital innovation", "tech articles"],
  openGraph: {
    title: "Blog Posts - Cumi Digital Insights",
    description: "Read our latest blog posts about web development, technology trends, digital innovation, and industry insights from the Cumi team.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Posts - Cumi Digital Insights",
    description: "Read our latest blog posts about web development, technology trends, digital innovation, and industry insights from the Cumi team.",
  },
};

export default function BlogPostsPage() {
  return <BlogPostsPageComponent />;
}
