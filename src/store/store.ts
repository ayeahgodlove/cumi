import { configureStore } from "@reduxjs/toolkit";
import { postAPI } from "./api/post_api";
import { categoryAPI } from "./api/category_api";
import { tagAPI } from "./api/tag_api";
import { userAPI } from "./api/user_api";
import { eventAPI } from "./api/event_api";
import { courseAPI } from "./api/course_api";
import { projectAPI } from "./api/project_api";
import { bannerAPI } from "./api/banner_api";
import { serviceAPI } from "./api/service_api";
import { opportunityAPI } from "./api/opportunity_api";
import { statsAPI } from "./api/stats_api";
import { publicStatsAPI } from "./api/public-stats_api";
import { moduleAPI } from "./api/module_api";
import { assignmentAPI } from "./api/assignment_api";
import { courseProgressAPI } from "./api/course-progress_api";
import { courseEnrollmentAPI } from "./api/course-enrollment_api";
import { eventRegistrationAPI } from "./api/event-registration_api";
import { lessonAPI } from "./api/lesson_api";
import { commentAPI } from "./api/comment_api";
import { commentInteractionAPI } from "./api/comment-interaction_api";
import { postInteractionAPI } from "./api/post-interaction_api";
import { quizAPI } from "./api/quiz_api";
import { learningAPI } from "./api/learning_api";
import { reviewAPI } from "./api/review_api";
import { quizSubmissionAPI } from "./api/quiz-submission_api";
import { assignmentSubmissionAPI } from "./api/assignment-submission_api";
import { partnerAPI } from "./api/partner_api";

export const store = configureStore({
  reducer: {
    [postAPI.reducerPath]: postAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [tagAPI.reducerPath]: tagAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [eventAPI.reducerPath]: eventAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [projectAPI.reducerPath]: projectAPI.reducer,
    [bannerAPI.reducerPath]: bannerAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [opportunityAPI.reducerPath]: opportunityAPI.reducer,
    [statsAPI.reducerPath]: statsAPI.reducer,
    [publicStatsAPI.reducerPath]: publicStatsAPI.reducer,
    [moduleAPI.reducerPath]: moduleAPI.reducer,
    [assignmentAPI.reducerPath]: assignmentAPI.reducer,
    [courseProgressAPI.reducerPath]: courseProgressAPI.reducer,
    [courseEnrollmentAPI.reducerPath]: courseEnrollmentAPI.reducer,
    [eventRegistrationAPI.reducerPath]: eventRegistrationAPI.reducer,
    [lessonAPI.reducerPath]: lessonAPI.reducer,
    [commentAPI.reducerPath]: commentAPI.reducer,
    [commentInteractionAPI.reducerPath]: commentInteractionAPI.reducer,
    [postInteractionAPI.reducerPath]: postInteractionAPI.reducer,
    [quizAPI.reducerPath]: quizAPI.reducer,
    [learningAPI.reducerPath]: learningAPI.reducer,
    [reviewAPI.reducerPath]: reviewAPI.reducer,
    [quizSubmissionAPI.reducerPath]: quizSubmissionAPI.reducer,
    [assignmentSubmissionAPI.reducerPath]: assignmentSubmissionAPI.reducer,
    [partnerAPI.reducerPath]: partnerAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      postAPI.middleware,
      categoryAPI.middleware,
      tagAPI.middleware,
      userAPI.middleware,
      eventAPI.middleware,
      courseAPI.middleware,
      projectAPI.middleware,
      bannerAPI.middleware,
      serviceAPI.middleware,
      opportunityAPI.middleware,
      statsAPI.middleware,
      publicStatsAPI.middleware,
      moduleAPI.middleware,
      assignmentAPI.middleware,
      courseProgressAPI.middleware,
      courseEnrollmentAPI.middleware,
      eventRegistrationAPI.middleware,
      lessonAPI.middleware,
      commentAPI.middleware,
      commentInteractionAPI.middleware,
      postInteractionAPI.middleware,
      quizAPI.middleware,
      learningAPI.middleware,
      reviewAPI.middleware,
      quizSubmissionAPI.middleware,
      assignmentSubmissionAPI.middleware,
      partnerAPI.middleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
