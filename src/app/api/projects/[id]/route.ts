import Project from "@data/entities/project";
import { ProjectRepository } from "@data/repositories/impl/project.repository";
import { emptyProject, IProject } from "@domain/models/project.model";
import { ProjectUseCase } from "@domain/usecases/project.usecase";
import { ProjectRequestDto } from "@presentation/dtos/project-request.dto";
import { ProjectMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const projectRepository = new ProjectRepository();
const projectUseCase = new ProjectUseCase(projectRepository);
const projectMapper = new ProjectMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new ProjectRequestDto(await req.json());
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
      const obj: IProject = {
        ...emptyProject,
        ...dto.toData(),
        id: id,
        userId,
      };
      const updatedProject = await projectUseCase.updateProject(obj);
      const projectDto = projectMapper.toDTO(updatedProject);

      return NextResponse.json(
        {
          data: projectDto,
          message: "Project Updated Successfully!",
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

    const project = await projectUseCase.getProjectById(id);
    if (!project) {
      throw new NotFoundException("Project", id);
    }
    const projectDTO = projectMapper.toDTO(project);
    return NextResponse.json(projectDTO);
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

    await projectUseCase.deleteProject(id);

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
