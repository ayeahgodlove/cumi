import Post from "@data/entities/post";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IPostRepository } from "../contracts/repository.base";
import { IPost } from "@domain/models/post.model";

export class PostRepository implements IPostRepository{
  /**
   *
   */
  constructor() {}

    /**
   * Receives a String as parameter
   * @title
   * returns Category
   */
    async findByTitle(title: string): Promise<Post | null> {
      try {
        const post = await Post.findOne({ where: { title } });
        return post;
      } catch (error) {
        throw error;
      }
    }

    async findBySlug(slug: string): Promise<Post | null> {
      try {
        const post = await Post.findOne({ where: { slug } });
        return post;
      } catch (error) {
        throw error;
      }
    }
  /**
   * Receives a Post as parameter
   * @post
   * returns void
   */
  async create(post: IPost): Promise<Post> {
    try {
      return await Post.create<Post>({ ...post });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Post
   */
  async findById(id: string): Promise<Post | null> {
    try {
      const postItem = await Post.findByPk(id);

      if (!postItem) {
        throw new NotFoundException("Post", id);
      }
      return postItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Post
   */
  async getAll(): Promise<Post[]> {
    try {
      const categories = await Post.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Post as parameter
   * @post
   * returns void
   */
  async update(post: IPost): Promise<Post> {
    const { id } = post;
    try {
      const postItem: any = await Post.findByPk(id);

      console.log(post);
      if (!postItem) {
        throw new NotFoundException("Post", id.toString());
      }

      return await postItem?.update({ ...post });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const postItem = await Post.findByPk(id);

      if (!postItem) {
        throw new NotFoundException("Post", id);
      }

      await postItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
