/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  useFetchAllCoursesQuery,
} from "@store/api/course_api";
import { 
  useFetchAllPostsQuery,
} from "@store/api/post_api";
import { 
  useFetchAllEventsQuery,
} from "@store/api/event_api";
import { 
  useFetchAllCourseEnrollmentsQuery,
} from "@store/api/course-enrollment_api";
import { userAPI } from "@store/api/user_api";
import { ICourse } from "@domain/models/course";
import { IPost } from "@domain/models/post.model";
import { IEvent } from "@domain/models/event.model";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { IUser } from "@domain/models/user";

interface GeneralDashboardData {
  // Platform content
  courses: ICourse[];
  posts: IPost[];
  events: IEvent[];
  courseEnrollments: ICourseEnrollment[];
  users: IUser[];
  
  // Statistics
  stats: {
    totalCourses: number;
    totalPosts: number;
    totalEvents: number;
    totalUsers: number;
    totalEnrollments: number;
    activeUsers: number;
    completedCourses: number;
    averageCourseRating: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  
  // Recent activity
  recentData: {
    recentCourses: ICourse[];
    recentPosts: IPost[];
    recentEvents: IEvent[];
    recentUsers: IUser[];
    recentEnrollments: ICourseEnrollment[];
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingCourses: boolean;
  isLoadingPosts: boolean;
  isLoadingEvents: boolean;
  isLoadingUsers: boolean;
  isLoadingEnrollments: boolean;
}

export const useGeneralDashboard = (): GeneralDashboardData => {
  const { data: session } = useSession();

  // Fetch all platform data
  const { 
    data: coursesData, 
    isLoading: isLoadingCourses 
  } = useFetchAllCoursesQuery(1);

  const { 
    data: postsData, 
    isLoading: isLoadingPosts 
  } = useFetchAllPostsQuery({});

  const { 
    data: eventsData, 
    isLoading: isLoadingEvents 
  } = useFetchAllEventsQuery(1);

  const { 
    data: usersData, 
    isLoading: isLoadingUsers 
  } = userAPI.useFetchAllUsersQuery(1);

  const { 
    data: courseEnrollmentsData, 
    isLoading: isLoadingEnrollments 
  } = useFetchAllCourseEnrollmentsQuery({});

  // Process data
  const courses = coursesData || [];
  const posts = postsData || [];
  const events = eventsData || [];
  const users = usersData || [];
  const courseEnrollments = courseEnrollmentsData?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const activeUsers = users.filter((u: IUser) => u.accountStatus === 'active').length;
    const completedCourses = courseEnrollments.filter((e: ICourseEnrollment) => 
      e.status === 'completed'
    ).length;
    
    const totalRevenue = courseEnrollments.reduce((sum: number, e: ICourseEnrollment) => 
      sum + (e.amountPaid || 0), 0
    );
    
    // Calculate monthly growth (simplified)
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const currentMonthEnrollments = courseEnrollments.filter((e: ICourseEnrollment) => 
      new Date(e.enrollmentDate).getMonth() === currentMonth
    ).length;
    
    const lastMonthEnrollments = courseEnrollments.filter((e: ICourseEnrollment) => 
      new Date(e.enrollmentDate).getMonth() === lastMonth
    ).length;
    
    const monthlyGrowth = lastMonthEnrollments > 0 
      ? ((currentMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100 
      : 0;

    return {
      totalCourses: courses.length,
      totalPosts: posts.length,
      totalEvents: events.length,
      totalUsers: users.length,
      totalEnrollments: courseEnrollments.length,
      activeUsers,
      completedCourses,
      averageCourseRating: 0, // Would need rating system
      totalRevenue,
      monthlyGrowth,
    };
  }, [courses, posts, events, users, courseEnrollments]);

  // Get recent activity
  const recentData = useMemo(() => ({
    recentCourses: courses
      .sort((a: ICourse, b: ICourse) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
    recentPosts: posts
      .sort((a: IPost, b: IPost) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 5),
    recentEvents: events
      .sort((a: IEvent, b: IEvent) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      )
      .slice(0, 5),
    recentUsers: users
      .filter((u: IUser) => u.createdAt)
      .sort((a: IUser, b: IUser) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 5),
    recentEnrollments: courseEnrollments
      .sort((a: ICourseEnrollment, b: ICourseEnrollment) => 
        new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()
      )
      .slice(0, 5),
  }), [courses, posts, events, users, courseEnrollments]);

  const isLoading = isLoadingCourses || isLoadingPosts || isLoadingEvents || 
                   isLoadingUsers || isLoadingEnrollments;

  return {
    courses,
    posts,
    events,
    courseEnrollments,
    users,
    stats,
    recentData,
    isLoading,
    isLoadingCourses,
    isLoadingPosts,
    isLoadingEvents,
    isLoadingUsers,
    isLoadingEnrollments,
  };
};

