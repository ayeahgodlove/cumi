import { Metadata } from "next";
import TagsPageComponent from "@components/page-components/tags-page.component";

export const metadata: Metadata = {
  title: "Tags - Cumi Blog Categories",
  description: "Browse all blog post tags and categories on Cumi's blog. Find articles by topics including web development, technology, programming, and digital innovation.",
  keywords: ["blog tags", "article categories", "web development topics", "technology tags", "programming categories", "digital innovation"],
  openGraph: {
    title: "Tags - Cumi Blog Categories",
    description: "Browse all blog post tags and categories on Cumi's blog. Find articles by topics including web development, technology, programming, and digital innovation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tags - Cumi Blog Categories",
    description: "Browse all blog post tags and categories on Cumi's blog. Find articles by topics including web development, technology, programming, and digital innovation.",
  },
};

export default function TagsPage() {
  return <TagsPageComponent />;
}
