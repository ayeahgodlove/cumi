import { PartnerRepository } from "@data/repositories/impl/partner.repository";
import { PartnerUseCase } from "@domain/usecases/partner.usecase";
import authOptions from "@lib/options";
import { PartnerRequestDto } from "@presentation/dtos/partner-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const partnerRepository = new PartnerRepository();
const partnerUseCase = new PartnerUseCase(partnerRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          data: null,
          message: "Unauthorized",
          validationErrors: [],
          success: false,
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const partner = await partnerUseCase.getById(id);

    if (!partner) {
      return NextResponse.json(
        {
          data: null,
          message: `Partner with id ${id} not found`,
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(partner);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized",
        validationErrors: [],
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();
    const partnerRequestDto = new PartnerRequestDto(body);
    const validationErrors = await validate(partnerRequestDto);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          data: null,
          message: "Validation failed",
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
        },
        { status: 400 }
      );
    }

    const partnerData = partnerRequestDto.toData();
    const updatedPartner = await partnerUseCase.update(id, partnerData);

    if (!updatedPartner) {
      return NextResponse.json(
        {
          data: null,
          message: `Partner with id ${id} not found`,
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: updatedPartner,
        message: "Partner updated successfully",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized",
        validationErrors: [],
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const deleted = await partnerUseCase.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          data: null,
          message: `Partner with id ${id} not found`,
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: "Partner deleted successfully",
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