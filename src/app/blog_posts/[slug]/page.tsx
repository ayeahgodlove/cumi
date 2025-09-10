import { Metadata } from "next";
import BlogPostDetailPageComponent from "@components/page-components/blog-post-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";

interface BlogPostDetailPageProps {
  params: { slug: string };
}

// Fetch blog post details for SEO
const fetchBlogPostDetails = async (slug: string) => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/slugs/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch blog post details");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Blog Post - CUMI Technology Blog",
      description: "Read our latest technology insights and software development articles.",
      url: "https://cumi.dev/blog_posts"
    });
  }

  const post = await fetchBlogPostDetails(params.slug);
  
  if (!post) {
    return generatePageMetadata({
      title: "Blog Post - CUMI Technology Blog",
      description: "Read our latest technology insights and software development articles.",
      url: `https://cumi.dev/blog_posts/${params.slug}`
    });
  }

  const postImage = post.imageUrl 
    ? `${process.env.NEXTAUTH_URL}/uploads/posts/${post.imageUrl}`
    : defaultImages[0];

  const keywords = [
    "software development",
    "web development",
    "technology insights",
    "programming",
    "digital innovation",
    post.title,
    ...(post.tags?.map((tag: any) => tag.name) || []),
    ...(post.category?.name ? [post.category.name] : [])
  ];

  return generatePageMetadata({
    title: `${post.title} - CUMI Technology Blog`,
    description: post.description || `Read our detailed article about ${post.title}. Learn about software development, web applications, and technology insights from CUMI's expert team.`,
    keywords,
    url: `https://cumi.dev/blog_posts/${params.slug}`,
    image: postImage,
    images: [
      {
        url: postImage,
        width: 1200,
        height: 630,
        alt: post.title
      }
    ],
    publishedTime: new Date(post.createdAt).toISOString(),
    modifiedTime: new Date(post.updatedAt).toISOString(),
    alternates: {
      canonical: `https://cumi.dev/blog_posts/${params.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || `Read our detailed article about ${post.title}`,
      images: [postImage],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/blog_posts/${params.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || `Read our detailed article about ${post.title}`,
      images: [postImage],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('blogPost', {
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      authorName: post.authorName,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      slug: params.slug
    })
  });
}

export default function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  return <BlogPostDetailPageComponent slug={params.slug} />;
}
