import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IAssignment {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  userId: string;
  assignmentType: 'essay' | 'project' | 'practical' | 'presentation' | 'research' | 'coding' | 'design';
  status: 'draft' | 'published' | 'archived';
  assignmentOrder: number;
  maxScore: number;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes?: number;
  availableFrom?: Date;
  dueDate?: Date;
  lateSubmissionAllowed: boolean;
  latePenaltyPercent?: number;
  submissionFormat: 'text' | 'file_upload' | 'url' | 'both_text_file';
  allowedFileTypes?: string;
  maxFileSizeMb?: number;
  minWordCount?: number;
  maxWordCount?: number;
  autoGrade: boolean;
  rubric?: any;
  peerReviewEnabled: boolean;
  peerReviewsRequired?: number;
  referenceMaterials?: string;
  sampleSubmissions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyAssignment: IAssignment = {
  id: "",
  title: "",
  slug: "",
  description: "",
  instructions: "",
  courseId: "",
  moduleId: "",
  lessonId: "",
  userId: "",
  assignmentType: 'essay',
  status: 'draft',
  assignmentOrder: 1,
  maxScore: 100.00,
  passingScore: 50.00,
  maxAttempts: 3,
  timeLimitMinutes: 0,
  availableFrom: undefined,
  dueDate: undefined,
  lateSubmissionAllowed: true,
  latePenaltyPercent: 0,
  submissionFormat: 'text',
  allowedFileTypes: "",
  maxFileSizeMb: 10,
  minWordCount: 0,
  maxWordCount: 0,
  autoGrade: false,
  rubric: {},
  peerReviewEnabled: false,
  peerReviewsRequired: 0,
  referenceMaterials: "",
  sampleSubmissions: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IAssignmentState extends IBaseState {
  readonly assignments: IAssignment[];
  readonly assignment: IAssignment;
}

export interface IAssignmentResponse extends IResponseBase {
  data: IAssignment;
}

export interface IAssignmentResponses extends IResponseBase {
  data: IAssignment[];
}

