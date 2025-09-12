import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  useFetchAllCoursesQuery,
} from "@store/api/course_api";
import { 
  useFetchAllCourseEnrollmentsQuery,
} from "@store/api/course-enrollment_api";
import { 
  useFetchAllLessonsQuery,
} from "@store/api/lesson_api";
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
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { ILesson } from "@domain/models/lesson";
import { IModule } from "@domain/models/module.model";
import { IAssignment } from "@domain/models/assignment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";

interface StudentDashboardData {
  // Student's enrolled courses
  enrolledCourses: ICourse[];
  courseEnrollments: ICourseEnrollment[];
  
  // LMS data for enrolled courses
  lessons: ILesson[];
  modules: IModule[];
  assignments: IAssignment[];
  courseProgress: ICourseProgress[];
  
  // Statistics
  stats: {
    totalEnrolledCourses: number;
    totalCompletedCourses: number;
    totalInProgressCourses: number;
    totalLessons: number;
    totalModules: number;
    totalAssignments: number;
    completedLessons: number;
    completedAssignments: number;
    averageProgress: number;
    totalTimeSpent: number;
    certificatesEarned: number;
  };
  
  // Recent activity
  recentData: {
    recentEnrollments: ICourseEnrollment[];
    recentProgress: ICourseProgress[];
    upcomingDeadlines: IAssignment[];
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingEnrollments: boolean;
  isLoadingCourses: boolean;
  isLoadingLessons: boolean;
  isLoadingModules: boolean;
  isLoadingAssignments: boolean;
  isLoadingCourseProgress: boolean;
}

export const useStudentDashboard = (): StudentDashboardData => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  // Fetch student's course enrollments
  const { 
    data: courseEnrollmentsData, 
    isLoading: isLoadingEnrollments 
  } = useFetchAllCourseEnrollmentsQuery(
    { userId: currentUser?.id },
    { skip: !currentUser?.id }
  );

  const courseEnrollments = courseEnrollmentsData?.data || [];
  const enrolledCourseIds = courseEnrollments.map((enrollment: ICourseEnrollment) => enrollment.courseId);

  // Fetch enrolled courses
  const { 
    data: coursesData, 
    isLoading: isLoadingCourses 
  } = useFetchAllCoursesQuery(1, {
    skip: enrolledCourseIds.length === 0
  });

  // Filter courses to only include enrolled ones
  const enrolledCourses = useMemo(() => {
    if (!coursesData) return [];
    return coursesData.filter((course: ICourse) => enrolledCourseIds.includes(course.id));
  }, [coursesData, enrolledCourseIds]);

  // Fetch lessons for enrolled courses
  const { 
    data: lessonsData, 
    isLoading: isLoadingLessons 
  } = useFetchAllLessonsQuery(
    { courseId: enrolledCourseIds.join(',') },
    { skip: enrolledCourseIds.length === 0 }
  );

  // Fetch modules for enrolled courses
  const { 
    data: modulesData, 
    isLoading: isLoadingModules 
  } = useFetchAllModulesQuery(
    { courseId: enrolledCourseIds.join(',') },
    { skip: enrolledCourseIds.length === 0 }
  );

  // Fetch assignments for enrolled courses
  const { 
    data: assignmentsData, 
    isLoading: isLoadingAssignments 
  } = useFetchAllAssignmentsQuery(
    { courseId: enrolledCourseIds.join(',') },
    { skip: enrolledCourseIds.length === 0 }
  );

  // Fetch course progress for enrolled courses
  const { 
    data: courseProgressData, 
    isLoading: isLoadingCourseProgress 
  } = useFetchAllCourseProgressQuery(
    { userId: currentUser?.id },
    { skip: !currentUser?.id }
  );

  const lessons = lessonsData?.data || [];
  const modules = modulesData?.data || [];
  const assignments = assignmentsData?.data || [];
  const courseProgress = courseProgressData?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCompletedCourses = courseEnrollments.filter((e: ICourseEnrollment) => e.status === 'completed').length;
    const totalInProgressCourses = courseEnrollments.filter((e: ICourseEnrollment) => e.status === 'active').length;
    
    const completedLessons = courseProgress.filter((p: ICourseProgress) => 
      p.progressType === 'lesson' && p.status === 'completed'
    ).length;
    
    const completedAssignments = courseProgress.filter((p: ICourseProgress) => 
      p.progressType === 'assignment' && p.status === 'completed'
    ).length;
    
    const totalTimeSpent = courseProgress.reduce((total: number, p: ICourseProgress) => 
      total + (p.timeSpentMinutes || 0), 0
    );
    
    const certificatesEarned = courseEnrollments.filter((e: ICourseEnrollment) => 
      e.certificateIssued
    ).length;
    
    const averageProgress = courseEnrollments.length > 0 
      ? courseEnrollments.reduce((sum: number, e: ICourseEnrollment) => sum + (e.progress || 0), 0) / courseEnrollments.length 
      : 0;

    return {
      totalEnrolledCourses: courseEnrollments.length,
      totalCompletedCourses,
      totalInProgressCourses,
      totalLessons: lessons.length,
      totalModules: modules.length,
      totalAssignments: assignments.length,
      completedLessons,
      completedAssignments,
      averageProgress,
      totalTimeSpent,
      certificatesEarned,
    };
  }, [courseEnrollments, lessons, modules, assignments, courseProgress]);

  // Get recent activity
  const recentData = useMemo(() => ({
    recentEnrollments: courseEnrollments
      .sort((a: ICourseEnrollment, b: ICourseEnrollment) => 
        new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()
      )
      .slice(0, 3),
    recentProgress: courseProgress
      .sort((a: ICourseProgress, b: ICourseProgress) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5),
    upcomingDeadlines: assignments
      .filter((a: IAssignment) => {
        if (!a.dueDate) return false;
        const dueDate = new Date(a.dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue >= 0 && daysUntilDue <= 7; // Next 7 days
      })
      .sort((a: IAssignment, b: IAssignment) => 
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 5),
  }), [courseEnrollments, courseProgress, assignments]);

  const isLoading = isLoadingEnrollments || isLoadingCourses || isLoadingLessons || 
                   isLoadingModules || isLoadingAssignments || isLoadingCourseProgress;

  return {
    enrolledCourses,
    courseEnrollments,
    lessons,
    modules,
    assignments,
    courseProgress,
    stats,
    recentData,
    isLoading,
    isLoadingEnrollments,
    isLoadingCourses,
    isLoadingLessons,
    isLoadingModules,
    isLoadingAssignments,
    isLoadingCourseProgress,
  };
};
