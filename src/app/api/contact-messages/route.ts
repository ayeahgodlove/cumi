import { NextRequest, NextResponse } from "next/server";
import { ContactMessageUseCase } from "@domain/usecases/contact-message.usecase";
import { ContactMessageRepository } from "@data/repositories/impl/contact-message.repository";
import { contactMessageMapper } from "@presentation/mappers/contact-message.mapper";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";

const contactMessageUseCase = new ContactMessageUseCase(new ContactMessageRepository());

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized: Please log in to access this resource.",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 401 }
      );
    }

    const messages = await contactMessageUseCase.getAll();
    const messagesMapped = contactMessageMapper.toDTOs(messages as any);
    
    return NextResponse.json(messagesMapped);
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch contact messages",
        validationErrors: [],
        success: false,
      },
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
