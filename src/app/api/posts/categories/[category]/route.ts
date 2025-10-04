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
    
    // If no posts found, return empty array instead of error
    if (!posts || posts.length === 0) {
      return NextResponse.json([]);
    }

    const postsDTO = postMapper.toDTOs(posts);

    return NextResponse.json(postsDTO);
  } catch (error: any) {
    console.error(`Error fetching posts for category ${params.category}:`, error);
    
    // Return empty array instead of error for better UX
    return NextResponse.json([]);
  }
}
