/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useFetchAllLessonsQuery } from "@store/api/lesson_api"
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
import {
    useFetchAllModulesQuery,
} from "@store/api/module_api";
import {
    useFetchAllAssignmentsQuery,
} from "@store/api/assignment_api";
import {
    useFetchAllCourseProgressQuery,
} from "@store/api/course-progress_api";
import { ICourse } from "@domain/models/course";
import { IPost } from "@domain/models/post.model";
import { IEvent } from "@domain/models/event.model";
import { ILesson } from "@domain/models/lesson";
import { IModule } from "@domain/models/module.model";
import { IAssignment } from "@domain/models/assignment.model";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";

interface CreatorDashboardData {
    // Main content
    courses: ICourse[];
    posts: IPost[];
    events: IEvent[];

    // LMS data
    courseEnrollments: ICourseEnrollment[];
    lessons: ILesson[];
    modules: IModule[];
    assignments: IAssignment[];
    courseProgress: ICourseProgress[];

    // Statistics
    stats: {
        totalCourses: number;
        totalPosts: number;
        totalEvents: number;
        totalCourseEnrollments: number;
        totalLessons: number;
        totalModules: number;
        totalAssignments: number;
        totalStudents: number;
        totalRevenue: number;
        averageRating: number;
        completionRate: number;
    };

    // Recent activity
    recentData: {
        recentCourses: ICourse[];
        recentPosts: IPost[];
        recentEvents: IEvent[];
    };

    // Loading states
    isLoading: boolean;
    isLoadingCourses: boolean;
    isLoadingPosts: boolean;
    isLoadingEvents: boolean;
    isLoadingCourseEnrollments: boolean;
    isLoadingLessons: boolean;
    isLoadingModules: boolean;
    isLoadingAssignments: boolean;
    isLoadingCourseProgress: boolean;
}

export const useCreatorDashboard = (): CreatorDashboardData => {
    const { data: session } = useSession();
    const currentUser = session?.user;

    // Fetch creator's courses
    const {
        data: coursesData,
        isLoading: isLoadingCourses
    } = useFetchAllCoursesQuery(1, {
        skip: !currentUser?.id
    });

    // Fetch creator's posts
    const {
        data: postsData,
        isLoading: isLoadingPosts
    } = useFetchAllPostsQuery({}, {
        skip: !currentUser?.id
    });

    // Fetch creator's events
    const {
        data: eventsData,
        isLoading: isLoadingEvents
    } = useFetchAllEventsQuery(1, {
        skip: !currentUser?.id
    });

    // Get course IDs for related data fetching
    const courseIds = useMemo(() =>
        coursesData?.map((course: ICourse) => course.id) || [],
        [coursesData]
    );

    // Fetch course enrollments for creator's courses
    const {
        data: courseEnrollmentsData,
        isLoading: isLoadingCourseEnrollments
    } = useFetchAllCourseEnrollmentsQuery(
        { courseId: courseIds.join(',') },
        { skip: courseIds.length === 0 }
    );

    // Fetch lessons for creator's courses
    const {
        data: lessonsData,
        isLoading: isLoadingLessons
    } = useFetchAllLessonsQuery(
        { courseId: courseIds.join(',') },
        { skip: courseIds.length === 0 }
    );

    // Fetch modules for creator's courses
    const {
        data: modulesData,
        isLoading: isLoadingModules
    } = useFetchAllModulesQuery(
        { courseId: courseIds.join(',') },
        { skip: courseIds.length === 0 }
    );

    // Fetch assignments for creator's courses
    const {
        data: assignmentsData,
        isLoading: isLoadingAssignments
    } = useFetchAllAssignmentsQuery(
        { courseId: courseIds.join(',') },
        { skip: courseIds.length === 0 }
    );

    // Fetch course progress for creator's courses
    const {
        data: courseProgressData,
        isLoading: isLoadingCourseProgress
    } = useFetchAllCourseProgressQuery(
        { courseId: courseIds.join(',') },
        { skip: courseIds.length === 0 }
    );

    // Process data
    const courses = coursesData || [];
    const posts = postsData || [];
    const events = eventsData || [];
    const courseEnrollments = courseEnrollmentsData?.data || [];
    const lessons = lessonsData?.data || [];
    const modules = modulesData?.data || [];
    const assignments = assignmentsData?.data || [];
    const courseProgress = courseProgressData?.data || [];

    // Calculate statistics
    const stats = useMemo(() => {
        const totalStudents = new Set(courseEnrollments.map((e: ICourseEnrollment) => e.userId)).size;
        const totalRevenue = courseEnrollments.reduce((sum: number, e: ICourseEnrollment) => sum + (e.amountPaid || 0), 0);
        const completedProgress = courseProgress.filter((p: ICourseProgress) => p.status === 'completed').length;
        const completionRate = courseProgress.length > 0 ? (completedProgress / courseProgress.length) * 100 : 0;

        // Calculate average rating from courses (courses don't have rating property)
        const averageRating = 0;

        return {
            totalCourses: courses.length,
            totalPosts: posts.length,
            totalEvents: events.length,
            totalCourseEnrollments: courseEnrollments.length,
            totalLessons: lessons.length,
            totalModules: modules.length,
            totalAssignments: assignments.length,
            totalStudents,
            totalRevenue,
            averageRating,
            completionRate,
        };
    }, [courses, posts, events, courseEnrollments, lessons, modules, assignments, courseProgress]);

  // Get recent activity (latest 3 items of each type)
  const recentData = useMemo(() => ({
    recentCourses: [...courses]
      .sort((a: ICourse, b: ICourse) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    recentPosts: [...posts]
      .sort((a: IPost, b: IPost) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3),
    recentEvents: [...events]
      .sort((a: IEvent, b: IEvent) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 3),
  }), [courses, posts, events]);

    const isLoading = isLoadingCourses || isLoadingPosts || isLoadingEvents ||
        isLoadingCourseEnrollments || isLoadingLessons || isLoadingModules ||
        isLoadingAssignments || isLoadingCourseProgress;

    return {
        courses,
        posts,
        events,
        courseEnrollments,
        lessons,
        modules,
        assignments,
        courseProgress,
        stats,
        recentData,
        isLoading,
        isLoadingCourses,
        isLoadingPosts,
        isLoadingEvents,
        isLoadingCourseEnrollments,
        isLoadingLessons,
        isLoadingModules,
        isLoadingAssignments,
        isLoadingCourseProgress,
    };
};
