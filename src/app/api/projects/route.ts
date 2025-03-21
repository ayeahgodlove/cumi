import Project from "@data/entities/project";
import { ProjectRepository } from "@data/repositories/impl/project.repository";
import { ProjectUseCase } from "@domain/usecases/project.usecase";
import authOptions from "@lib/options";
import { ProjectRequestDto } from "@presentation/dtos/project-request.dto";
import { ProjectMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const projectRepository = new ProjectRepository();
const projectUseCase = new ProjectUseCase(projectRepository);
const projectMapper = new ProjectMapper();

export async function GET(request: any) {
  try {
    const categories = await Project.findAll();

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
  const session = await getServerSession(authOptions); //get session info

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

  try {
    const body = await request.json();
    const dto = new ProjectRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;
    
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

    const projectResponse = await projectUseCase.createProject({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: projectResponse.toJSON(),
        message: "project created Successfully!",
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
