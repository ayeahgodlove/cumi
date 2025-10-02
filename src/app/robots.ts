import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cumi.dev";
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about_us",
          "/our_services",
          "/our_services/",
          "/contact_us",
          "/blog_posts",
          "/blog_posts/",
          "/projects",
          "/projects/",
          "/events",
          "/events/",
          "/courses",
          "/courses/",
          "/opportunities",
          "/opportunities/",
          "/partners",
          "/partners/",
          "/categories",
          "/categories/",
          "/tags",
          "/tags/",
          "/authors",
          "/authors/",
          "/faqs",
          "/login",
          "/register",
          "/forgot-password",
        ],
        disallow: [
          "/dashboard",
          "/api",
          "/admin",
          "/private-",
          "/_next",
          "/uploads",
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
