import EventRegistrationRepository from "@data/repositories/event-registration.repository";
import EventRegistrationUsecase from "@domain/usecases/event-registration.usecase";
import authOptions from "@lib/options";
import { CreateEventRegistrationDto } from "@presentation/dtos/event-registration.dto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@services/notification.service";
import { eventUseCase } from "@domain/usecases/event.usecase";

const eventRegistrationRepository = new EventRegistrationRepository();
const eventRegistrationUseCase = new EventRegistrationUsecase();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (eventId) {
      const isRegistered = await eventRegistrationUseCase.checkUserRegistration(eventId, session.user.id);
      return NextResponse.json({ registered: isRegistered, success: true });
    } else {
      const registrations = await eventRegistrationUseCase.getEventRegistrationsByUserId(session.user.id);
      return NextResponse.json(registrations);
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch event registrations",
        validationErrors: [],
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: Please log in to access this resource.", success: false, data: null, validationErrors: [] },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const userId = session.user.id;

    // Basic validation
    if (!body.eventId) {
      return NextResponse.json(
        {
          validationErrors: ["Event ID is required"],
          success: false,
          data: null,
          message: "Validation failed",
        },
        { status: 400 }
      );
    }

    const registrationData = {
      eventId: body.eventId,
      userId,
      name: body.name || session.user.name || "User",
      email: body.email || session.user.email || "",
      phone: body.phone || "",
      company: body.company,
      dietaryRequirements: body.dietaryRequirements,
      additionalNotes: body.additionalNotes,
      paymentAmount: body.paymentAmount,
      paymentMethod: body.paymentMethod,
      registrationDate: new Date(),
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
    };

    const registrationResponse = await eventRegistrationUseCase.createEventRegistration(registrationData);

    // Send registration notification email
    try {
      const event = await eventUseCase.getEventById(body.eventId);
      if (event) {
        await notificationService.notifyEventRegistration(
          userId,
          event.title,
          `/events/${event.id}`
        );
      }
    } catch (emailError) {
      console.error("Failed to send registration notification:", emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json(
      {
        data: registrationResponse,
        message: "Successfully registered for the event!",
        validationErrors: [],
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Registration failed",
        validationErrors: [],
        success: false,
      },
      { status: 500 }
    );
  }
}