import { PostRepository } from "@data/repositories/impl/post.repository";
import { PostUseCase } from "@domain/usecases/post.usecase";
import authOptions from "@lib/options";
import { PostRequestDto } from "@presentation/dtos/post-request.dto";
import { PostMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const postRepository = new PostRepository();
const postUseCase = new PostUseCase(postRepository);
const postMapper = new PostMapper();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTitle = searchParams.get("searchTitle");
    const sortBy = searchParams.get("sortBy");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const authorId = searchParams.get("authorId");

    // For public blog posts, we don't require authentication
    // Only require auth for admin/dashboard access
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    let posts;
    if (isAdmin) {
      // Admin gets all posts including drafts
      posts = await postUseCase.getAll();
    } else {
      // Public gets only published posts
      posts = await postUseCase.getPublishedPosts();
    }

    // Apply author filter if provided
    if (authorId) {
      posts = posts.filter(post => {
        const postData = post.toJSON();
        return postData.authorId === authorId;
      });
    }

    // Apply search filter
    if (searchTitle) {
      posts = posts.filter(post => {
        const postData = post.toJSON();
        return postData.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
               postData.description.toLowerCase().includes(searchTitle.toLowerCase());
      });
    }

    // Apply sorting
    if (sortBy) {
      posts = posts.sort((a, b) => {
        const aData = a.toJSON();
        const bData = b.toJSON();
        switch (sortBy) {
          case "title":
            return aData.title.localeCompare(bData.title);
          case "createdAt":
            return new Date(bData.createdAt).getTime() - new Date(aData.createdAt).getTime();
          case "publishedAt":
            return new Date(bData.publishedAt).getTime() - new Date(aData.publishedAt).getTime();
          default:
            return 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    const postsDto = postMapper.toDTOs(paginatedPosts);
    
    return NextResponse.json(postsDto);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json([], { status: 500 });
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
    const dto = new PostRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;
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



