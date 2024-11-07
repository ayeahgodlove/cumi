import { PostRepository } from "@data/repositories/impl/post.repository";
import { PostUseCase } from "@domain/usecases/post.usecase";
import { PostRequestDto } from "@presentation/dtos/post-request.dto";
import { PostMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const postRepository = new PostRepository();
const postUseCase = new PostUseCase(postRepository);
const postMapper = new PostMapper();

export async function GET(request: any) {
  try {
    const posts = await postUseCase.getAll();
    const postsDto = postMapper.toDTOs(posts);
    return NextResponse.json(postsDto);
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
  const dto = new PostRequestDto(body);
  const validationErrors = await validate(dto);
  const userId = request.headers.get("X-User-Id") || "";
  // Begin transaction if needed

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
    const postResponse = await postUseCase.createPost({
      ...dto.toData(),
      authorId: userId,
    });

    return NextResponse.json(
      {
        data: postResponse.toJSON(),
        message: "post created Successfully!",
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
