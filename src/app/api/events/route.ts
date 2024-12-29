import Event from "@data/entities/event";
import { EventRepository } from "@data/repositories/impl/event.repository";
import { EventUseCase } from "@domain/usecases/event.usecase";
import { EventRequestDto } from "@presentation/dtos/event-request.dto";
import { EventMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const eventRepository = new EventRepository();
const eventUseCase = new EventUseCase(eventRepository);
const eventMapper = new EventMapper();

export async function GET(request: any) {
  try {
    const categories = await Event.findAll();

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const dto = new EventRequestDto(body);
  const validationErrors = await validate(dto);
  const userId = request.headers.get("X-User-Id") || "";

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: displayValidationErrors(validationErrors),
        success: false,
        data: null,
        message: "Attention!",
      },
      { status: 400 }
    );
  }

  try {
    const eventResponse = await eventUseCase.createEvent({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: eventResponse.toJSON(),
        message: "event created Successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}