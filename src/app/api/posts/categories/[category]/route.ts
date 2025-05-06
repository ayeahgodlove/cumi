import { PostRepository } from "@data/repositories/impl/post.repository";
import { PostUseCase } from "@domain/usecases/post.usecase";
import { PostMapper } from "@presentation/mappers/mapper";
import { NextResponse, NextRequest } from "next/server";

const postRepository = new PostRepository();
const postUseCase = new PostUseCase(postRepository);
const postMapper = new PostMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;

    const posts = await postUseCase.getPostByCategory(category);
    const postsDTO = postMapper.toDTOs(posts!);

    return NextResponse.json(postsDTO);
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
