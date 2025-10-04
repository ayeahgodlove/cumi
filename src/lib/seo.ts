import { Metadata } from 'next';

const url = process.env.NEXTAUTH_URL || "https://cumi.dev";

// Base keywords for the website
export const baseKeywords = [
  "software development",
  "web development",
  "mobile app development",
  "digital solutions",
  "technology consulting",
  "CUMI",
  "custom software",
  "business automation",
  "digital transformation",
  "IT services",
  "software engineering",
  "full-stack development",
  "cloud solutions",
  "database design",
  "API development",
  "user experience design",
  "responsive web design",
  "e-commerce solutions",
  "content management systems",
  "progressive web apps"
];

// Default images for SEO
export const defaultImages = [
  `${url}/uploads/media/1022.jpg`,
  `${url}/uploads/img/IMG_4491-min.jpeg`,
  `${url}/uploads/img/relaxing.jpg`
];

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  publishedTime?: string;
  modifiedTime?: string;
  alternates?: {
    canonical?: string;
  };
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    images?: string[];
    siteName?: string;
    locale?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
  schema?: any;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    url: pageUrl = url,
    image = defaultImages[0],
    images = [],
    publishedTime,
    modifiedTime,
    alternates,
    openGraph,
    twitter,
    schema
  } = options;

  const allKeywords = [...baseKeywords, ...keywords].join(", ");

  return {
    metadataBase: new URL(pageUrl),
    title: {
      default: title,
      template: `%s | CUMI`,
    },
    description,
    keywords: allKeywords,
    manifest: `${url}/site.webmanifest`,
    appleWebApp: {
      title: "CUMI",
      statusBarStyle: "default",
      capable: true,
      startupImage: "/apple-touch-icon.png",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: images.length > 0 ? images.map(img => img.url) : [image],
      creator: "@cumi_dev",
      ...twitter
    },
    alternates: {
      canonical: alternates?.canonical || pageUrl,
      ...alternates
    },
    openGraph: {
      title: title,
      description: description,
      images: images.length > 0 ? images.map(img => img.url) : [image],
      siteName: "CUMI",
      locale: "en_US",
      url: pageUrl,
      type: "website",
      ...openGraph
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(schema && { 'application/ld+json': JSON.stringify(schema) })
    }
  };
}

// Utility function to fetch data from API
export async function fetchApiData(endpoint: string) {
  try {
    const response = await fetch(`${url}${endpoint}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

// Utility function to generate structured data for different content types
export function generateStructuredData(type: string, data: any) {
  const baseUrl = url;
  
  switch (type) {
    case 'blogPost':
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/posts/${data.imageUrl}` : defaultImages[0],
        "author": {
          "@type": "Person",
          "name": data.authorName || "CUMI Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "CUMI",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "datePublished": data.createdAt,
        "dateModified": data.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/blog_posts/${data.slug}`
        }
      };
      
    case 'project':
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/projects/${data.imageUrl}` : defaultImages[0],
        "url": `${baseUrl}/projects/${data.id}`,
        "creator": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "dateCreated": data.createdAt,
        "dateModified": data.updatedAt
      };
      
    case 'event':
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/events/${data.imageUrl}` : defaultImages[0],
        "startDate": data.startDate,
        "endDate": data.endDate,
        "location": data.location,
        "organizer": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "USD"
        }
      };
      
    case 'course':
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/courses/${data.imageUrl}` : defaultImages[0],
        "provider": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "USD"
        }
      };
      
    case 'organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CUMI",
        "description": "Leading software development and digital solutions company",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-XXX-XXX-XXXX",
          "contactType": "customer service",
          "email": "info@cumi.dev"
        },
        "sameAs": [
          "https://twitter.com/cumi_dev",
          "https://linkedin.com/company/cumi"
        ]
      };
      
    default:
      return null;
  }
}

