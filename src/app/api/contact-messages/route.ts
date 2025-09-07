import { NextRequest, NextResponse } from "next/server";
import { ContactMessageUseCase } from "@domain/usecases/contact-message.usecase";
import { ContactMessageRepository } from "@data/repositories/contact-message.repository";
import { contactMessageMapper } from "@presentation/mappers/contact-message.mapper";

const contactMessageUseCase = new ContactMessageUseCase(new ContactMessageRepository());

export async function GET(request: NextRequest) {
  try {
    const messages = await contactMessageUseCase.getAll();
    const messagesMapped = contactMessageMapper.toDTOs(messages as any);
    return NextResponse.json(messagesMapped);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = await contactMessageUseCase.create(body);
    const messageDTO = contactMessageMapper.toDTO(message as any);
    return NextResponse.json(messageDTO, { status: 201 });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to create contact message" },
      { status: 500 }
    );
  }
}
