import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

// Create a single base API instance
export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    credentials: 'include',
  }),
  tagTypes: [
    "Post",
    "Course",
    "Event",
    "User",
    "Category",
    "Tag",
    "Assignment",
    "Quiz",
    "Module",
    "Lesson",
    "CourseEnrollment",
    "CourseProgress",
    "Comment",
    "Review",
    "Partner",
    "Service",
    "Banner",
    "PublicStats",
    "Stats",
    "Project",
    "Opportunity",
    "Professional",
    "EventRegistration",
    "CommentInteraction",
    "PostInteraction",
    "AssignmentSubmission",
    "QuizSubmission",
    "UserAssignmentSubmissions",
    "CourseAssignmentSubmissions",
    "UserQuizSubmissions",
    "CourseQuizSubmissions",
    "CourseModules",
    "LessonProgress",
    "CourseReviews",
    "UserReviews",
  ],
  endpoints: () => ({}), // Endpoints will be injected
});

