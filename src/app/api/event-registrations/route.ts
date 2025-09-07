import { NextRequest, NextResponse } from "next/server";
import EventRegistrationUsecase from "@domain/usecases/event-registration.usecase";
import { EventRegistrationMapper } from "@presentation/mappers/event-registration.mapper";
import { CreateEventRegistrationDto } from "@presentation/dtos/event-registration.dto";

const eventRegistrationUsecase = new EventRegistrationUsecase();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    let eventRegistrations;

    if (eventId) {
      eventRegistrations = await eventRegistrationUsecase.getEventRegistrationsByEventId(eventId);
    } else if (userId) {
      eventRegistrations = await eventRegistrationUsecase.getEventRegistrationsByUserId(userId);
    } else {
      eventRegistrations = await eventRegistrationUsecase.getAllEventRegistrations();
    }

    return NextResponse.json({
      success: true,
      data: eventRegistrations.map(registration => EventRegistrationMapper.toDto(registration)),
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEventRegistrationDto = await request.json();
    
    // Validate required fields
    if (!body.eventId || !body.userId || !body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventRegistration = await eventRegistrationUsecase.createEventRegistration(body);

    return NextResponse.json({
      success: true,
      data: EventRegistrationMapper.toDto(eventRegistration),
      message: 'Event registration created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event registration:', error);
    
    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create event registration' },
      { status: 500 }
    );
  }
}
