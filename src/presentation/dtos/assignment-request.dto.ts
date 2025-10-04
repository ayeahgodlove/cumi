import { emptyAssignment, IAssignment } from "@domain/models/assignment.model";
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString } from "class-validator";
import { nanoid } from "nanoid";

export class AssignmentRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(['essay', 'project', 'practical', 'presentation', 'research', 'coding', 'design'])
  assignmentType?: 'essay' | 'project' | 'practical' | 'presentation' | 'research' | 'coding' | 'design';

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsNumber()
  assignmentOrder?: number;

  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @IsNumber()
  maxAttempts?: number;

  @IsOptional()
  @IsNumber()
  timeLimitMinutes?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  lateSubmissionAllowed?: boolean;

  @IsOptional()
  @IsNumber()
  latePenaltyPercent?: number;

  @IsOptional()
  @IsEnum(['text', 'file_upload', 'url', 'both_text_file'])
  submissionFormat?: 'text' | 'file_upload' | 'url' | 'both_text_file';

  @IsOptional()
  @IsString()
  allowedFileTypes?: string;

  @IsOptional()
  @IsNumber()
  maxFileSizeMb?: number;

  @IsOptional()
  @IsNumber()
  minWordCount?: number;

  @IsOptional()
  @IsNumber()
  maxWordCount?: number;

  @IsOptional()
  @IsBoolean()
  autoGrade?: boolean;

  @IsOptional()
  rubric?: any;

  @IsOptional()
  @IsBoolean()
  peerReviewEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  peerReviewsRequired?: number;

  @IsOptional()
  @IsString()
  referenceMaterials?: string;

  @IsOptional()
  @IsString()
  sampleSubmissions?: string;

  constructor(data: IAssignment) {
    this.title = data.title;
    this.slug = data.slug;
    this.description = data.description;
    this.instructions = data.instructions;
    this.courseId = data.courseId;
    this.moduleId = data.moduleId;
    this.lessonId = data.lessonId;
    this.userId = data.userId || "";
    this.assignmentType = data.assignmentType;
    this.status = data.status;
    this.assignmentOrder = data.assignmentOrder;
    this.maxScore = data.maxScore;
    this.passingScore = data.passingScore;
    this.maxAttempts = data.maxAttempts;
    this.timeLimitMinutes = data.timeLimitMinutes;
    this.availableFrom = data.availableFrom instanceof Date ? data.availableFrom.toISOString() : (data.availableFrom as any);
    this.dueDate = data.dueDate instanceof Date ? data.dueDate.toISOString() : (data.dueDate as any);
    this.lateSubmissionAllowed = data.lateSubmissionAllowed;
    this.latePenaltyPercent = data.latePenaltyPercent;
    this.submissionFormat = data.submissionFormat;
    this.allowedFileTypes = data.allowedFileTypes;
    this.maxFileSizeMb = data.maxFileSizeMb;
    this.minWordCount = data.minWordCount;
    this.maxWordCount = data.maxWordCount;
    this.autoGrade = data.autoGrade;
    this.rubric = data.rubric;
    this.peerReviewEnabled = data.peerReviewEnabled;
    this.peerReviewsRequired = data.peerReviewsRequired;
    this.referenceMaterials = data.referenceMaterials;
    this.sampleSubmissions = data.sampleSubmissions;
  }

  toData(): IAssignment {
    return {
      ...emptyAssignment,
      id: nanoid(20),
      title: this.title,
      slug: this.slug,
      description: this.description,
      instructions: this.instructions,
      courseId: this.courseId,
      moduleId: this.moduleId,
      lessonId: this.lessonId,
      userId: this.userId || '',
      assignmentType: this.assignmentType ?? 'essay',
      status: this.status ?? 'draft',
      assignmentOrder: this.assignmentOrder ?? 1,
      maxScore: this.maxScore ?? 100.00,
      passingScore: this.passingScore ?? 50.00,
      maxAttempts: this.maxAttempts ?? 3,
      timeLimitMinutes: this.timeLimitMinutes,
      availableFrom: this.availableFrom ? new Date(this.availableFrom) : undefined,
      dueDate: this.dueDate ? new Date(this.dueDate) : undefined,
      lateSubmissionAllowed: this.lateSubmissionAllowed ?? true,
      latePenaltyPercent: this.latePenaltyPercent,
      submissionFormat: this.submissionFormat ?? 'text',
      allowedFileTypes: this.allowedFileTypes,
      maxFileSizeMb: this.maxFileSizeMb ?? 10,
      minWordCount: this.minWordCount,
      maxWordCount: this.maxWordCount,
      autoGrade: this.autoGrade ?? false,
      rubric: this.rubric,
      peerReviewEnabled: this.peerReviewEnabled ?? false,
      peerReviewsRequired: this.peerReviewsRequired,
      referenceMaterials: this.referenceMaterials,
      sampleSubmissions: this.sampleSubmissions,
    };
  }

  toUpdateData(data: IAssignment): IAssignment {
    return {
      id: data.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      instructions: this.instructions,
      courseId: this.courseId,
      moduleId: this.moduleId,
      lessonId: this.lessonId,
      userId: this.userId || data.userId,
      assignmentType: this.assignmentType ?? data.assignmentType,
      status: this.status ?? data.status,
      assignmentOrder: this.assignmentOrder ?? data.assignmentOrder,
      maxScore: this.maxScore ?? data.maxScore,
      passingScore: this.passingScore ?? data.passingScore,
      maxAttempts: this.maxAttempts ?? data.maxAttempts,
      timeLimitMinutes: this.timeLimitMinutes,
      availableFrom: this.availableFrom ? new Date(this.availableFrom) : data.availableFrom,
      dueDate: this.dueDate ? new Date(this.dueDate) : data.dueDate,
      lateSubmissionAllowed: this.lateSubmissionAllowed ?? data.lateSubmissionAllowed,
      latePenaltyPercent: this.latePenaltyPercent,
      submissionFormat: this.submissionFormat ?? data.submissionFormat,
      allowedFileTypes: this.allowedFileTypes,
      maxFileSizeMb: this.maxFileSizeMb ?? data.maxFileSizeMb,
      minWordCount: this.minWordCount,
      maxWordCount: this.maxWordCount,
      autoGrade: this.autoGrade ?? data.autoGrade,
      rubric: this.rubric,
      peerReviewEnabled: this.peerReviewEnabled ?? data.peerReviewEnabled,
      peerReviewsRequired: this.peerReviewsRequired,
      referenceMaterials: this.referenceMaterials,
      sampleSubmissions: this.sampleSubmissions,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

