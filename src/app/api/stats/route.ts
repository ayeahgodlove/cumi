import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { PostRepository } from "@data/repositories/impl/post.repository";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { EventRepository } from "@data/repositories/impl/event.repository";
import { CourseRepository } from "@data/repositories/impl/course.repository";
import { ProjectRepository } from "@data/repositories/impl/project.repository";
import { OpportunityRepository } from "@data/repositories/impl/opportunity.repository";
import { ServiceRepository } from "@data/repositories/impl/service.repository";
import { ProfessionalRepository } from "@data/repositories/impl/professional.repository";
import { BannerRepository } from "@data/repositories/impl/banner.repository";
import { MediaRepository } from "@data/repositories/impl/media.repository";
import { ContactMessageRepository } from "@data/repositories/impl/contact-message.repository";
import { SubscriberRepository } from "@data/repositories/impl/subscriber.repository";

// Helper function to get time ago string
function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Stats API called');
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    console.log('User authorized, fetching stats...');

    // Initialize repositories
    const postRepository = new PostRepository();
    const userRepository = new UserRepository();
    const eventRepository = new EventRepository();
    const courseRepository = new CourseRepository();
    const projectRepository = new ProjectRepository();
    const opportunityRepository = new OpportunityRepository();
    const serviceRepository = new ServiceRepository();
    const professionalRepository = new ProfessionalRepository();
    const bannerRepository = new BannerRepository();
    const mediaRepository = new MediaRepository();
    const contactMessageRepository = new ContactMessageRepository();
    const subscriberRepository = new SubscriberRepository();

    // Fetch all counts in parallel with error handling
    const [
      totalUsers,
      totalPosts,
      totalEvents,
      totalCourses,
      totalProjects,
      totalOpportunities,
      totalServices,
      totalProfessionals,
      totalBanners,
      totalMedia,
      totalContactMessages,
      totalSubscribers
    ] = await Promise.all([
      userRepository.getAll().then(users => users.length).catch(() => 0),
      postRepository.getAll().then(posts => posts.length).catch(() => 0),
      eventRepository.getAll().then(events => events.length).catch(() => 0),
      courseRepository.getAll().then(courses => courses.length).catch(() => 0),
      projectRepository.getAll().then(projects => projects.length).catch(() => 0),
      opportunityRepository.getAll().then(opportunities => opportunities.length).catch(() => 0),
      serviceRepository.getAll().then(services => services.length).catch(() => 0),
      professionalRepository.getAll().then(professionals => professionals.length).catch(() => 0),
      bannerRepository.getAll().then(banners => banners.length).catch(() => 0),
      mediaRepository.getAll().then(media => media.length).catch(() => 0),
      contactMessageRepository.getAll().then(messages => messages.length).catch(() => 0),
      subscriberRepository.getAll().then(subscribers => subscribers.length).catch(() => 0)
    ]);

    // Calculate additional metrics
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get recent data and filter by date manually
    let recentActivities: any[] = [];
    let recentUsersFiltered: any[] = [];
    let recentPostsFiltered: any[] = [];
    let recentEventsFiltered: any[] = [];
    
    try {
      const [recentUsers, recentPosts, recentEvents, recentCourses] = await Promise.all([
        userRepository.getAll().catch(() => []),
        postRepository.getAll().catch(() => []),
        eventRepository.getAll().catch(() => []),
        courseRepository.getAll().catch(() => [])
      ]);

      // Filter recent users
      recentUsersFiltered = recentUsers.filter((user: any) => 
        new Date(user.createdAt) >= lastWeek
      );

      // Filter recent posts
      recentPostsFiltered = recentPosts.filter((post: any) => 
        new Date(post.createdAt) >= lastWeek
      );

      // Filter recent events
      recentEventsFiltered = recentEvents.filter((event: any) => 
        new Date(event.createdAt) >= lastWeek
      );

      // Filter recent courses
      const recentCoursesFiltered = recentCourses.filter((course: any) => 
        new Date(course.createdAt) >= lastWeek
      );

      // Build recent activities array
      recentActivities = [
        ...recentUsersFiltered.map((user: any) => ({
          key: `user-${user.id}`,
          user: user.username || user.email,
          action: 'Registered',
          item: 'New Account',
          time: getTimeAgo(user.createdAt),
          status: 'success',
          type: 'user'
        })),
        ...recentPostsFiltered.map((post: any) => ({
          key: `post-${post.id}`,
          user: 'Admin', // You might want to get the actual author
          action: 'Published',
          item: post.title,
          time: getTimeAgo(post.createdAt),
          status: 'success',
          type: 'post'
        })),
        ...recentEventsFiltered.map((event: any) => ({
          key: `event-${event.id}`,
          user: 'Admin', // You might want to get the actual creator
          action: 'Created',
          item: event.title,
          time: getTimeAgo(event.createdAt),
          status: 'success',
          type: 'event'
        })),
        ...recentCoursesFiltered.map((course: any) => ({
          key: `course-${course.id}`,
          user: 'Admin', // You might want to get the actual creator
          action: 'Created',
          item: course.title,
          time: getTimeAgo(course.createdAt),
          status: 'success',
          type: 'course'
        }))
      ].sort((a: any, b: any) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      }).slice(0, 10); // Get latest 10

    } catch (error) {
      console.warn('Error fetching recent activities:', error);
      recentActivities = [];
    }

    // Calculate growth percentages
    const userGrowth = totalUsers > 0 ? Math.round((recentUsersFiltered?.length || 0) / totalUsers * 100) : 0;
    const postGrowth = totalPosts > 0 ? Math.round((recentPostsFiltered?.length || 0) / totalPosts * 100) : 0;
    const eventGrowth = totalEvents > 0 ? Math.round((recentEventsFiltered?.length || 0) / totalEvents * 100) : 0;

    // Get opportunities by type (simplified with error handling)
    let opportunitiesByType = {};
    try {
      const allOpportunities = await opportunityRepository.getAll();
      opportunitiesByType = allOpportunities.reduce((acc: any, opp: any) => {
        acc[opp.opp_type] = (acc[opp.opp_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.warn('Error fetching opportunities:', error);
      opportunitiesByType = {};
    }

    // Get posts by category (simplified with error handling)
    let postsByCategory = {};
    try {
      const allPosts = await postRepository.getAll();
      postsByCategory = allPosts.reduce((acc: any, post: any) => {
        acc[post.categoryId] = (acc[post.categoryId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.warn('Error fetching posts:', error);
      postsByCategory = {};
    }

    const stats = {
      overview: {
        totalUsers,
        totalPosts,
        totalEvents,
        totalCourses,
        totalProjects,
        totalOpportunities,
        totalServices,
        totalProfessionals,
        totalBanners,
        totalMedia,
        totalMessages: totalContactMessages,
        totalSubscribers
      },
      recentActivity: {
        newUsers: recentUsersFiltered?.length || 0,
        newPosts: recentPostsFiltered?.length || 0,
        newEvents: recentEventsFiltered?.length || 0
      },
      recentActivities: recentActivities,
      growth: {
        userGrowth: userGrowth,
        postGrowth: postGrowth,
        eventGrowth: eventGrowth
      },
      breakdown: {
        opportunitiesByType: opportunitiesByType,
        postsByCategory: postsByCategory
      },
      lastUpdated: now.toISOString()
    };

    console.log('Stats retrieved successfully:', stats);
    
    return NextResponse.json({
      success: true,
      message: "Stats retrieved successfully",
      data: stats
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch stats",
        data: null,
      },
      { status: 500 }
    );
  }
}
