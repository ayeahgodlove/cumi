import Event from "@data/entities/event";
import { EventRepository } from "@data/repositories/impl/event.repository";
import { emptyEvent, IEvent } from "@domain/models/event.model";
import { EventUseCase } from "@domain/usecases/event.usecase";
import { EventRequestDto } from "@presentation/dtos/event-request.dto";
import { EventMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const eventRepository = new EventRepository();
const eventUseCase = new EventUseCase(eventRepository);
const eventMapper = new EventMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new EventRequestDto(await req.json());
  const validationErrors = await validate(dto);
  const userId = req.headers.get("X-User-Id") || "";

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!",
      },
      { status: 400 }
    );
  } else {
    try {
      const id = params.id;
      const obj: IEvent = {
        ...emptyEvent,
        ...dto.toData(),
        id: id,
        userId,
      };
      const updatedEvent = await eventUseCase.updateEvent(obj);
      const eventDto = eventMapper.toDTO(updatedEvent);

      return NextResponse.json(
        {
          data: eventDto,
          message: "Event Updated Successfully!",
          validationErrors: [],
          success: true,
        },
        { status: 200 }
      );
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const event = await eventUseCase.getEventById(id);
    if (!event) {
      throw new NotFoundException("Event", id);
    }
    const eventDTO = eventMapper.toDTO(event);
    return NextResponse.json(eventDTO);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await eventUseCase.deleteEvent(id);

    return NextResponse.json({
      message: `Operation successfully completed!`,
      validationErrors: [],
      success: true,
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      },
      { status: 400 }
    );
  }
}
