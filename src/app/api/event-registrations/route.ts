import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { EventRegistration } from "@domain/models/event-registration.model";
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
      eventId, 
      userId, 
      name,
      email,
      phone,
      company,
      dietaryRequirements,
      additionalNotes,
      paymentAmount = 0,
      paymentMethod
    } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        {
          message: "Event ID and User ID are required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          message: "Name, email, and phone number are required",
          success: false,
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      where: { eventId, userId }
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          message: "User is already registered for this event",
          success: false,
          data: null,
        },
        { status: 409 }
      );
    }

    // Determine appropriate defaults based on event
    const event = await sequelize.models.Event.findByPk(eventId);
    const isFree = event?.getDataValue('isFree') || false;
    
    // Create new registration
    const registration = await EventRegistration.create({
      id: nanoid(20),
      eventId,
      userId,
      name,
      email,
      phone,
      company,
      dietaryRequirements,
      additionalNotes,
      status: 'pending', // Default to pending, admin will confirm
      paymentStatus: isFree ? 'paid' : 'pending', // Set based on event type
      paymentAmount: isFree ? 0 : paymentAmount,
      paymentMethod: isFree ? 'free' : paymentMethod,
      registrationDate: new Date(),
    });

    return NextResponse.json(
      {
        data: registration.toJSON(),
        message: "Successfully registered for event!",
        success: true,
      },
      { status: 201 }
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
    const eventId = searchParams.get("eventId");

    let whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (eventId) whereClause.eventId = eventId;

    const registrations = await EventRegistration.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(
      {
        data: registrations.map(r => r.toJSON()),
        message: "Event registrations retrieved successfully",
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