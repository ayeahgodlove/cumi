import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://cumi.dev";

  try {
    // Fetch dynamic content in parallel
    const [
      postsResponse,
      projectsResponse,
      eventsResponse,
      coursesResponse,
      opportunitiesResponse,
      categoriesResponse,
      tagsResponse,
      servicesResponse,
    ] = await Promise.all([
      fetch(`${baseUrl}/api/posts`).catch(() => null),
      fetch(`${baseUrl}/api/projects`).catch(() => null),
      fetch(`${baseUrl}/api/events`).catch(() => null),
      fetch(`${baseUrl}/api/courses`).catch(() => null),
      fetch(`${baseUrl}/api/opportunities`).catch(() => null),
      fetch(`${baseUrl}/api/categories`).catch(() => null),
      fetch(`${baseUrl}/api/tags`).catch(() => null),
      fetch(`${baseUrl}/api/services`).catch(() => null),
    ]);

    // Parse responses safely
    const posts = postsResponse ? await postsResponse.json().catch(() => []) : [];
    const projects = projectsResponse ? await projectsResponse.json().catch(() => []) : [];
    const events = eventsResponse ? await eventsResponse.json().catch(() => []) : [];
    const courses = coursesResponse ? await coursesResponse.json().catch(() => []) : [];
    const opportunities = opportunitiesResponse ? await opportunitiesResponse.json().catch(() => []) : [];
    const categories = categoriesResponse ? await categoriesResponse.json().catch(() => []) : [];
    const tags = tagsResponse ? await tagsResponse.json().catch(() => []) : [];
    const services = servicesResponse ? await servicesResponse.json().catch(() => []) : [];

    // Generate dynamic URLs
    const postsData = posts?.data?.map((post: any) => ({
      url: `${baseUrl}/blog_posts/${post?.slug}`,
      lastModified: new Date(post?.updatedAt || post?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: post?.imageUrl ? [
        {
          url: `${baseUrl}/uploads/posts/${post?.imageUrl}`,
          alt: post?.title,
        },
      ] : [],
    })) || [];

    const projectsData = projects?.data?.map((project: any) => ({
      url: `${baseUrl}/projects/${project?.id}`,
      lastModified: new Date(project?.updatedAt || project?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: project?.imageUrl ? [
        {
          url: `${baseUrl}/uploads/projects/${project?.imageUrl}`,
          alt: project?.title,
        },
      ] : [],
    })) || [];

    const eventsData = events?.data?.map((event: any) => ({
      url: `${baseUrl}/events/${event?.id}`,
      lastModified: new Date(event?.updatedAt || event?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: event?.imageUrl ? [
        {
          url: `${baseUrl}/uploads/events/${event?.imageUrl}`,
          alt: event?.title,
        },
      ] : [],
    })) || [];

    const coursesData = courses?.data?.map((course: any) => ({
      url: `${baseUrl}/courses/${course?.id}`,
      lastModified: new Date(course?.updatedAt || course?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: course?.imageUrl ? [
        {
          url: `${baseUrl}/uploads/courses/${course?.imageUrl}`,
          alt: course?.title,
        },
      ] : [],
    })) || [];

    const opportunitiesData = opportunities?.data?.map((opportunity: any) => ({
      url: `${baseUrl}/opportunities/${opportunity?.id}`,
      lastModified: new Date(opportunity?.updatedAt || opportunity?.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    const servicesData = services?.data?.map((service: any) => ({
      url: `${baseUrl}/our_services/${service?.slug}`,
      lastModified: new Date(service?.updatedAt || service?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: service?.imageUrl ? [
        {
          url: `${baseUrl}/uploads/services/${service?.imageUrl}`,
          alt: service?.title,
        },
      ] : [],
    })) || [];

    const categoriesData = categories?.data?.map((category: any) => ({
      url: `${baseUrl}/categories/${category?.slug}`,
      lastModified: new Date(category?.updatedAt || category?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || [];

    const tagsData = tags?.data?.map((tag: any) => ({
      url: `${baseUrl}/tags/${tag?.slug}`,
      lastModified: new Date(tag?.updatedAt || tag?.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || [];

    // Static URLs
    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about_us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/our_services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact_us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog_posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/opportunities`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/tags`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/authors`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/faqs`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];

    // Combine all URLs
    return [
      ...staticUrls,
      ...postsData,
      ...projectsData,
      ...eventsData,
      ...coursesData,
      ...opportunitiesData,
      ...servicesData,
      ...categoriesData,
      ...tagsData,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static URLs only
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about_us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/our_services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact_us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog_posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/events`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/courses`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/opportunities`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/tags`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/authors`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/faqs`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];
  }
}