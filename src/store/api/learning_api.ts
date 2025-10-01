import { baseAPI } from "./base-api";

export interface IModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  courseId: string;
  userId: string;
  moduleOrder: number;
  status: 'draft' | 'published' | 'archived';
  learningObjectives: string;
  prerequisites: string;
  estimatedDurationHours: number;
  isLocked: boolean;
  unlockDate: Date | null;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  completedLessons: number;
  isCompleted: boolean;
  progress: number;
  lessons: ILesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  userId: string;
  courseId: string;
  moduleId: string;
  authorName: string;
  difficulty: string;
  prerequisites: string[];
  objectives: string[];
  keywords: string[];
  reviews: any[];
  language: string;
  rating: number;
  durationMinutes: number;
  lessonOrder: number;
  status: 'draft' | 'published' | 'archived';
  lessonType: 'video' | 'text' | 'audio' | 'practical' | 'discussion' | 'assignment';
  videoUrl: string;
  audioUrl: string;
  downloadMaterials: string;
  isFreePreview: boolean;
  requiresCompletion: boolean;
  estimatedCompletionTime: number;
  practicalExamples: string;
  resourcesNeeded: string;
  isCompleted: boolean;
  assignments: IAssignment[];
  quizzes: IQuiz[];
  resources: IResource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  userId: string;
  assignmentType: 'essay' | 'project' | 'practical' | 'presentation' | 'research' | 'coding' | 'design';
  status: 'draft' | 'published' | 'archived';
  assignmentOrder: number;
  maxScore: number;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  availableFrom: Date;
  dueDate: Date;
  lateSubmissionAllowed: boolean;
  latePenaltyPercent: number;
  submissionFormat: 'text' | 'file_upload' | 'url' | 'both_text_file';
  allowedFileTypes: string;
  maxFileSizeMb: number;
  minWordCount: number;
  maxWordCount: number;
  autoGrade: boolean;
  rubric: any;
  peerReviewEnabled: boolean;
  peerReviewsRequired: number;
  referenceMaterials: string;
  sampleSubmissions: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuiz {
  id: string;
  question: string;
  answers: string[];
  slug: string;
  userId: string;
  lessonId: string;
  correctAnswerIndex: number;
  title: string;
  instructions: string;
  quizType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'essay';
  points: number;
  timeLimitMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  localExample: string;
  passRequired: boolean;
  quizOrder: number;
  status: 'draft' | 'published' | 'archived';
  language: 'french' | 'english' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  description?: string;
}

export interface ILessonProgress {
  id: string;
  enrollmentId: string;
  courseId: string;
  userId: string;
  lessonId: string;
  progressType: 'lesson';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  completionPercentage: number;
  timeSpentMinutes: number;
  startedAt: Date;
  completedAt: Date | null;
  lastAccessedAt: Date;
  score: number | null;
  maxScore: number | null;
  attempts: number;
  maxAttempts: number | null;
  currentPosition: number | null;
  totalDuration: number | null;
  bookmarks: any;
  notes: string | null;
  difficultyRating: 'very_easy' | 'easy' | 'moderate' | 'hard' | 'very_hard' | null;
  feedback: string | null;
  instructorFeedback: string | null;
  isMandatory: boolean;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

export const learningAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // Get course modules with lessons, assignments, and quizzes
    getCourseModules: build.query<IModule[], string>({
      query: (courseId) => `/courses/${courseId}/modules`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, courseId) => [
        { type: "CourseModules", id: courseId },
        ...((result || []).map(({ id }) => ({ type: "CourseModules" as const, id }))),
      ],
    }),

    // Get lesson progress for a specific lesson
    getLessonProgress: build.query<ILessonProgress | null, string>({
      query: (lessonId) => `/lessons/${lessonId}/progress`,
      transformResponse: (response: any) => {
        if (response && response.success) {
          return response.data;
        }
        return null;
      },
      providesTags: (result, error, lessonId) => [
        { type: "LessonProgress", id: lessonId },
      ],
    }),

    // Update lesson progress
    updateLessonProgress: build.mutation<
      ILessonProgress,
      {
        lessonId: string;
        courseId: string;
        enrollmentId: string;
        isCompleted?: boolean;
        completionPercentage?: number;
        timeSpentMinutes?: number;
        notes?: string;
        lastAccessedAt?: string;
      }
    >({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/${lessonId}/progress`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { lessonId, courseId }) => [
        { type: "LessonProgress", id: lessonId },
        { type: "CourseModules", id: courseId },
      ],
    }),

    // Get user's progress for all lessons in a course
    getUserCourseProgress: build.query<ILessonProgress[], string>({
      query: (courseId) => `/courses/${courseId}/progress`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, courseId) => [
        { type: "CourseModules", id: courseId },
        ...((result || []).map(({ lessonId }) => ({ type: "LessonProgress" as const, id: lessonId }))),
      ],
    }),

    // Get user's performance overview for a course
    getUserCoursePerformance: build.query<any, { courseId: string; userId?: string }>({
      query: ({ courseId, userId }) => {
        const params = userId ? `?userId=${userId}` : '';
        return `/courses/${courseId}/performance${params}`;
      },
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      providesTags: (result, error, { courseId }) => [
        { type: "CourseModules", id: `${courseId}-performance` },
      ],
    }),

    // Get user's last accessed lesson for a course
    getLastAccessedLesson: build.query<{ lessonId: string; lastAccessedAt: string; completionPercentage: number } | null, string>({
      query: (courseId) => `/courses/${courseId}/progress?includeLastAccessed=true`,
      transformResponse: (response: any) => {
        if (response && response.success && response.lastAccessedLesson) {
          return response.lastAccessedLesson;
        }
        return null;
      },
      providesTags: (result, error, courseId) => [
        { type: "CourseModules", id: `${courseId}-last-accessed` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCourseModulesQuery,
  useGetLessonProgressQuery,
  useUpdateLessonProgressMutation,
  useGetUserCourseProgressQuery,
  useGetUserCoursePerformanceQuery,
  useGetLastAccessedLessonQuery,
} = learningAPI;
