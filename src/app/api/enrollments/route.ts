import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { CourseEnrollment, User } from "@data/entities/index";
import { nanoid } from "nanoid";
import sequelize from "@database/db-sequelize.config";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { 
      courseId, 
      userId, 
      studentPhone,
      emergencyContact,
      educationLevel,
      motivation,
      studySchedule,
      preferredContact = 'whatsapp',
      internetAccess,
      certificateName,
      certificateLanguage = 'both',
      paymentMethod,
      amountPaid = 0
    } = body;

    if (!courseId || !userId) {
      return NextResponse.json(
        {
          message: "Course ID and User ID are required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    if (!studentPhone) {
      return NextResponse.json(
        {
          message: "Student phone number is required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    if (!motivation) {
      return NextResponse.json(
        {
          message: "Please tell us why you want to take this course",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      where: { courseId, userId }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          message: "User is already enrolled in this course",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // Use database transaction to ensure both enrollment and role update succeed together
    const transaction = await sequelize.transaction();
    
    try {
      // Determine appropriate defaults based on course
      const course = await sequelize.models.Course.findByPk(courseId);
      const isFree = course?.getDataValue('isFree') || false;
      
      // Create new enrollment
      const enrollment = await CourseEnrollment.create({
        id: nanoid(10),
        courseId,
        userId,
        status: 'active', // Default to active enrollment
        paymentStatus: isFree ? 'free' : 'pending', // Set based on course type
        enrollmentDate: new Date(),
        progress: 0, // Start with 0% progress
        studentPhone,
        emergencyContact,
        educationLevel,
        motivation,
        studySchedule,
        preferredContact,
        internetAccess,
        certificateName,
        certificateLanguage,
        paymentMethod: isFree ? 'free' : paymentMethod,
        amountPaid: isFree ? 0 : amountPaid,
      }, { transaction });

      // Update user role from "user" to "student" if they're currently just a "user"
      const user = await User.findByPk(userId, { transaction });
      let roleUpdated = false;
      
      if (user) {
        const userData = user.toJSON() as any;
        if (userData.role === 'user') {
          await user.update({ role: 'student' }, { transaction });
          roleUpdated = true;
          console.log(`Updated user ${userId} role from 'user' to 'student' after course enrollment`);
        }
      }

      // Commit the transaction
      await transaction.commit();

      return NextResponse.json(
        {
          data: enrollment.toJSON(),
          message: roleUpdated 
            ? "Successfully enrolled in course! Your role has been updated to student."
            : "Successfully enrolled in course!",
          success: true,
          roleUpdated,
        },
        { status: 201 }
      );
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    let whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (courseId) whereClause.courseId = courseId;

    const enrollments = await CourseEnrollment.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(
      {
        data: enrollments.map(e => e.toJSON()),
        message: "Enrollments retrieved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}
