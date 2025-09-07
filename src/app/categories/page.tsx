import { Metadata } from "next";
import CategoriesPageComponent from "@components/page-components/categories-page.component";

export const metadata: Metadata = {
  title: "Categories - Cumi Blog Topics",
  description: "Explore blog posts by categories including web development, programming, technology trends, and digital innovation topics on Cumi's blog.",
  keywords: ["blog categories", "web development topics", "programming categories", "technology articles", "digital innovation", "tech blog topics"],
  openGraph: {
    title: "Categories - Cumi Blog Topics",
    description: "Explore blog posts by categories including web development, programming, technology trends, and digital innovation topics on Cumi's blog.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Categories - Cumi Blog Topics",
    description: "Explore blog posts by categories including web development, programming, technology trends, and digital innovation topics on Cumi's blog.",
  },
};

export default function CategoriesPage() {
  return <CategoriesPageComponent />;
}
