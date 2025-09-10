import { NextRequest, NextResponse } from "next/server";
import { SubscriberUseCase } from "@domain/usecases/subscriber.usecase";
import { SubscriberRepository } from "@data/repositories/impl/subscriber.repository";
import { SubscriberMapper } from "@presentation/mappers/subscriber.mapper";
import { SubscriberRequestDto } from "@presentation/dtos/subscriber-request.dto";
import { validate } from "class-validator";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";

const subscriberRepository = new SubscriberRepository();
const subscriberUseCase = new SubscriberUseCase(subscriberRepository);
const subscriberMapper = new SubscriberMapper();

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

    const subscribers = await subscriberUseCase.getAll();
    const subscribersMapped = subscriberMapper.toDTOs(subscribers);
    
    return NextResponse.json(subscribersMapped);
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch subscribers",
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
    
    const subscriberDto = new SubscriberRequestDto();
    subscriberDto.email = body.email;
    subscriberDto.name = body.name;
    subscriberDto.isActive = body.isActive ?? true;

    const validationErrors = await validate(subscriberDto);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: displayValidationErrors(validationErrors),
        },
        { status: 400 }
      );
    }

    const subscriber = await subscriberUseCase.create(subscriberDto);
    const subscriberResponse = subscriberMapper.toDTO(subscriber);
    
    return NextResponse.json(subscriberResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create subscriber" 
      },
      { status: 500 }
    );
  }
}
