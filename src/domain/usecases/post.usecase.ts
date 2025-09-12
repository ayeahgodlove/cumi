import { IPostRepository } from "@data/repositories/contracts/repository.base";
import { IPost } from "@domain/models/post.model";
import slugify from "slugify";
import { Post } from "@data/entities/index";

export class PostUseCase {
  /**
   *
   */
  constructor(private readonly postRepository: IPostRepository) {}

  async createPost(post: IPost): Promise<InstanceType<typeof Post>> {
    const existingPost = await this.postRepository.findByTitle(post.title);

    if (existingPost) {
      throw new Error("Post already exists");
    }
    return this.postRepository.create(post);
  }

  async getAll(): Promise<InstanceType<typeof Post>[]> {
    return this.postRepository.getAll();
  }

  async getPublishedPosts(): Promise<InstanceType<typeof Post>[]> {
    return this.postRepository.findPublished();
  }

  async getPostById(id: string): Promise<InstanceType<typeof Post> | null> {
    return this.postRepository.findById(id);
  }

  async getPostBySlug(slug: string): Promise<InstanceType<typeof Post> | null> {
    return this.postRepository.findBySlug(slug);
  }
  async getPostByCategory(
    category: string
  ): Promise<InstanceType<typeof Post>[] | null> {
    return this.postRepository.findByCategory(category);
  }

  async getPostByTag(tag: string): Promise<InstanceType<typeof Post>[] | null> {
    return this.postRepository.findByTag(tag);
  }

  async updatePost(post: IPost): Promise<InstanceType<typeof Post>> {
    const obj: IPost = {
      ...post,
      slug: slugify(post.title, { lower: true, replacement: "-" }),
    };
    return this.postRepository.update(obj);
  }

  async deletePost(id: string): Promise<void> {
    return this.postRepository.delete(id);
  }
}
