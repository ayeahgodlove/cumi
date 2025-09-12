import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID } from "class-validator";
import { nanoid } from "nanoid";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}

export class CommentResponseDto {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  replies?: CommentResponseDto[];
}

export class CommentRequestDto {
  id: string;
  content: string;
  postId: string;
  parentId?: string;
  isApproved: boolean;

  constructor(data: any) {
    this.id = nanoid(10);
    this.content = data.content;
    this.postId = data.postId;
    this.parentId = data.parentId;
    this.isApproved = data.isApproved ?? true;
  }

  toData() {
    return {
      id: this.id,
      content: this.content,
      postId: this.postId,
      parentId: this.parentId,
      isApproved: this.isApproved,
    };
  }
}
