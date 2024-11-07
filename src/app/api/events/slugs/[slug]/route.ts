import { EventRepository } from "@data/repositories/impl/event.repository";
import { EventUseCase } from "@domain/usecases/event.usecase";
import { EventMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const eventRepository = new EventRepository();
const eventUseCase = new EventUseCase(eventRepository);
const eventMapper = new EventMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const event = await eventUseCase.getEventBySlug(slug);
    if (!event) {
      throw new NotFoundException("Event", slug);
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
