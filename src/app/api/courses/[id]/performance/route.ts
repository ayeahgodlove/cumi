import { QuizSubmissionRepository } from "@data/repositories/impl/quiz-submission.repository";
import { AssignmentSubmissionRepository } from "@data/repositories/impl/assignment-submission.repository";
import { QuizSubmissionUseCase } from "@domain/usecases/quiz-submission.usecase";
import { AssignmentSubmissionUseCase } from "@domain/usecases/assignment-submission.usecase";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const quizSubmissionRepository = new QuizSubmissionRepository();
const assignmentSubmissionRepository = new AssignmentSubmissionRepository();
const quizSubmissionUseCase = new QuizSubmissionUseCase(quizSubmissionRepository);
const assignmentSubmissionUseCase = new AssignmentSubmissionUseCase(assignmentSubmissionRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (sessionError: any) {
    console.error("Session decryption error:", sessionError);
    return NextResponse.json(
      {
        message: "Session error: Please clear your browser cookies and log in again.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access performance data.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const { id: courseId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;

    // Get user's quiz performance for the course
    const quizSubmissions = await quizSubmissionUseCase.getUserQuizPerformance(userId, courseId);
    
    // Get user's assignment submissions for the course
    const assignmentSubmissions = await assignmentSubmissionUseCase.getUserAssignmentPerformance(userId, courseId);

    // Calculate quiz statistics
    const quizStats = {
      totalQuizzes: quizSubmissions.length,
      averageQuizScore: quizSubmissions.length > 0 
        ? quizSubmissions.reduce((sum, sub) => sum + sub.getDataValue('percentage'), 0) / quizSubmissions.length 
        : 0,
      passedQuizzes: quizSubmissions.filter(sub => sub.getDataValue('isPassed')).length,
      quizPassRate: quizSubmissions.length > 0 
        ? (quizSubmissions.filter(sub => sub.getDataValue('isPassed')).length / quizSubmissions.length) * 100 
        : 0,
    };

    // Calculate assignment statistics
    const assignmentStats = {
      totalAssignments: assignmentSubmissions.length,
      averageAssignmentScore: assignmentSubmissions.length > 0 
        ? assignmentSubmissions.reduce((sum, sub) => sum + (sub.getDataValue('percentage') || 0), 0) / assignmentSubmissions.length 
        : 0,
      passedAssignments: assignmentSubmissions.filter(sub => sub.getDataValue('isPassed')).length,
      assignmentPassRate: assignmentSubmissions.length > 0 
        ? (assignmentSubmissions.filter(sub => sub.getDataValue('isPassed')).length / assignmentSubmissions.length) * 100 
        : 0,
      gradedAssignments: assignmentSubmissions.filter(sub => sub.getDataValue('status') === 'graded').length,
      pendingAssignments: assignmentSubmissions.filter(sub => sub.getDataValue('status') === 'submitted').length,
    };

    // Overall performance
    const overallStats = {
      totalActivities: quizStats.totalQuizzes + assignmentStats.totalAssignments,
      overallAverageScore: (quizStats.averageQuizScore + assignmentStats.averageAssignmentScore) / 2,
      overallPassRate: ((quizStats.passedQuizzes + assignmentStats.passedAssignments) / 
        (quizStats.totalQuizzes + assignmentStats.totalAssignments)) * 100 || 0,
    };

    const performanceData = {
      courseId,
      userId,
      quizPerformance: {
        submissions: quizSubmissions.map(sub => sub.toJSON()),
        statistics: quizStats,
      },
      assignmentPerformance: {
        submissions: assignmentSubmissions.map(sub => sub.toJSON()),
        statistics: assignmentStats,
      },
      overallPerformance: overallStats,
    };

    return NextResponse.json(
      {
        data: performanceData,
        message: "Course performance data retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching course performance:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch course performance",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
