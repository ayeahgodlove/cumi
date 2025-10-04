// src/domain/models/assignment-submission.model.ts

export interface IAssignmentSubmission {
  id: string;
  userId: string;
  assignmentId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  submissionText?: string;
  fileUrls?: string; // JSON array
  score?: number;
  maxScore: number;
  percentage?: number;
  attemptNumber: number;
  isPassed: boolean;
  isLate: boolean;
  latePenaltyApplied?: number;
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'returned' | 'resubmitted';
  instructorFeedback?: string;
  rubricScores?: string; // JSON object
  peerReviewScores?: string; // JSON array
  plagiarismScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyAssignmentSubmission: IAssignmentSubmission = {
  id: "",
  userId: "",
  assignmentId: "",
  courseId: "",
  moduleId: "",
  lessonId: "",
  submissionText: "",
  fileUrls: "[]",
  score: undefined,
  maxScore: 0,
  percentage: undefined,
  attemptNumber: 1,
  isPassed: false,
  isLate: false,
  latePenaltyApplied: undefined,
  submittedAt: new Date(),
  gradedAt: undefined,
  gradedBy: "",
  status: 'submitted',
  instructorFeedback: "",
  rubricScores: "{}",
  peerReviewScores: "[]",
  plagiarismScore: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

