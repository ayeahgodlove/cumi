import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cumi.dev";
  
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about_us",
        "/our_services",
        "/our_services/*",
        "/contact_us",
        "/blog_posts",
        "/blog_posts/*",
        "/projects",
        "/projects/*",
        "/events",
        "/events/*",
        "/courses",
        "/courses/*",
        "/opportunities",
        "/opportunities/*",
        "/partners",
        "/partners/*",
        "/categories",
        "/categories/*",
        "/tags",
        "/tags/*",
        "/authors",
        "/authors/*",
        "/faqs",
        "/login",
        "/register",
        "/forgot-password",
        "/sitemap.xml",
        "/robots.txt",
      ],
      disallow: [
        "/dashboard/*",
        "/api/*",
        "/admin/*",
        "/private-*",
        "/404",
        "/not-found",
        "/_next/*",
        "/uploads/*",
      ],
      crawlDelay: 10,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
