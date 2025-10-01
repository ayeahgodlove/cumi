/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  useFetchAllEventsQuery,
} from "@store/api/event_api";
import { 
  useFetchAllCourseEnrollmentsQuery,
} from "@store/api/course-enrollment_api";
import { 
  useGetUserEventRegistrationsQuery,
} from "@store/api/event-registration_api";
import { 
  useFetchAllCourseProgressQuery,
} from "@store/api/course-progress_api";
import { IEvent } from "@domain/models/event.model";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";
import { IEventRegistration } from "@store/api/event-registration_api";

interface UserDashboardData {
  // User's data
  events: IEvent[];
  courseEnrollments: ICourseEnrollment[];
  eventRegistrations: IEventRegistration[];
  courseProgress: ICourseProgress[];
  
  // Statistics
  stats: {
    totalEnrolledCourses: number;
    upcomingEvents: number;
    completedCourses: number;
    inProgressCourses: number;
    certificatesEarned: number;
    totalLessonsCompleted: number;
  };
  
  // Recent activity
  recentData: {
    recentEnrollments: ICourseEnrollment[];
    recentEventRegistrations: IEventRegistration[];
    recentProgress: ICourseProgress[];
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingEvents: boolean;
  isLoadingEnrollments: boolean;
  isLoadingEventRegistrations: boolean;
  isLoadingCourseProgress: boolean;
}

export const useUserDashboard = (): UserDashboardData => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  // Fetch all events (to filter upcoming ones)
  const { 
    data: eventsData, 
    isLoading: isLoadingEvents 
  } = useFetchAllEventsQuery(1, {
    skip: !currentUser?.id
  });

  // Fetch user's course enrollments
  const { 
    data: courseEnrollmentsData, 
    isLoading: isLoadingEnrollments 
  } = useFetchAllCourseEnrollmentsQuery(
    { userId: currentUser?.id },
    { skip: !currentUser?.id }
  );

  // Fetch user's event registrations
  const { 
    data: eventRegistrationsData, 
    isLoading: isLoadingEventRegistrations 
  } = useGetUserEventRegistrationsQuery(currentUser?.id || '', {
    skip: !currentUser?.id
  });

  // Fetch user's course progress
  const { 
    data: courseProgressData, 
    isLoading: isLoadingCourseProgress 
  } = useFetchAllCourseProgressQuery(
    { userId: currentUser?.id },
    { skip: !currentUser?.id }
  );

  // Process data
  const events = eventsData || [];
  const courseEnrollments = courseEnrollmentsData?.data || [];
  const eventRegistrations = eventRegistrationsData || [];
  const courseProgress = courseProgressData?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const completedCourses = courseEnrollments.filter((e: ICourseEnrollment) => 
      e.status === 'completed'
    ).length;
    
    const inProgressCourses = courseEnrollments.filter((e: ICourseEnrollment) => 
      e.status === 'active'
    ).length;
    
    const certificatesEarned = courseEnrollments.filter((e: ICourseEnrollment) => 
      e.certificateIssued
    ).length;

    // Get upcoming events (events user is registered for that are in the future)
    const now = new Date();
    const upcomingEvents = eventRegistrations.filter((reg: IEventRegistration) => {
      const event = events.find((e: IEvent) => e.id === reg.eventId);
      return event && new Date(event.eventDate) > now && reg.status === 'confirmed';
    }).length;

    // Count completed lessons from course progress
    const totalLessonsCompleted = courseProgress.filter((p: ICourseProgress) => 
      p.status === 'completed'
    ).length;

    return {
      totalEnrolledCourses: courseEnrollments.length,
      upcomingEvents,
      completedCourses,
      inProgressCourses,
      certificatesEarned,
      totalLessonsCompleted,
    };
  }, [courseEnrollments, eventRegistrations, events, courseProgress]);

  // Get recent activity
  const recentData = useMemo(() => ({
    recentEnrollments: [...courseEnrollments]
      .sort((a: ICourseEnrollment, b: ICourseEnrollment) => 
        new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime()
      )
      .slice(0, 3),
    recentEventRegistrations: [...eventRegistrations]
      .sort((a: IEventRegistration, b: IEventRegistration) => 
        new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
      )
      .slice(0, 3),
    recentProgress: [...courseProgress]
      .sort((a: ICourseProgress, b: ICourseProgress) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3),
  }), [courseEnrollments, eventRegistrations, courseProgress]);

  const isLoading = isLoadingEvents || isLoadingEnrollments || 
    isLoadingEventRegistrations || isLoadingCourseProgress;

  return {
    events,
    courseEnrollments,
    eventRegistrations,
    courseProgress,
    stats,
    recentData,
    isLoading,
    isLoadingEvents,
    isLoadingEnrollments,
    isLoadingEventRegistrations,
    isLoadingCourseProgress,
  };
};
