import { Metadata } from "next";
import BlogPostDetailPageComponent from "@components/page-components/blog-post-detail-page.component";
import { postAPI } from "@store/api/post_api";

interface BlogPostDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  // This would ideally fetch the post data, but since we're using RTK Query,
  // we'll create a basic metadata structure that can be enhanced
  const slug = params.slug;
  
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Cumi Blog`,
    description: `Read our detailed blog post about ${slug.replace(/-/g, ' ')}. Learn about web development, technology trends, and digital innovation from Cumi's expert team.`,
    keywords: ["blog post", "web development", "technology", "programming", "digital innovation", slug.replace(/-/g, ' ')],
    openGraph: {
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Cumi Blog`,
      description: `Read our detailed blog post about ${slug.replace(/-/g, ' ')}. Learn about web development, technology trends, and digital innovation from Cumi's expert team.`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Cumi Blog`,
      description: `Read our detailed blog post about ${slug.replace(/-/g, ' ')}. Learn about web development, technology trends, and digital innovation from Cumi's expert team.`,
    },
  };
}

export default function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  return <BlogPostDetailPageComponent slug={params.slug} />;
}
