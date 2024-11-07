import { ProjectRepository } from "@data/repositories/impl/project.repository";
import { ProjectUseCase } from "@domain/usecases/project.usecase";
import { ProjectMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const projectRepository = new ProjectRepository();
const projectUseCase = new ProjectUseCase(projectRepository);
const projectMapper = new ProjectMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const project = await projectUseCase.getProjectBySlug(slug);
    if (!project) {
      throw new NotFoundException("Project", slug);
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
