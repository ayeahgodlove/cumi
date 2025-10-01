import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IPostRepository } from "../contracts/repository.base";
import { IPost } from "@domain/models/post.model";
import sequelize from "@database/db-sequelize.config";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { Category, PostTag, Tag, Post } from "../../entities/index";
export class PostRepository implements IPostRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a String as parameter
   * @title
   * returns Category
   */
  async findByTitle(title: string): Promise<InstanceType<typeof Post> | null> {
    try {
      const post = await Post.findOne({
        where: { title },
        include: [
          {
            model: Category,
            as: "category", // Use the alias defined in associations
          },
          {
            model: Tag,
            as: "tags",
          },
        ],
      });
      return post;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Post> | null> {
    try {
      const post = await Post.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: "category", // Use the alias defined in associations
          },
          {
            model: Tag,
            as: "tags",
          },
        ],
      });
      return post;
    } catch (error) {
      throw error;
    }
  }

  async findByCategory(
    category: string
  ): Promise<InstanceType<typeof Post>[] | null> {
    try {
      const categoryItem = await Category.findOne({
        where: { slug: category },
      });

      if (!categoryItem) {
        console.warn(`Category not found with slug: ${category}`);
        return [];
      }
      const item = categoryItem.toJSON<ICategory>();

      const posts = await Post.findAll({
        where: { 
          categoryId: item.id,
          status: 'PUBLISHED' // Only return published posts
        },
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: Tag,
            as: "tags",
          },
        ],
        order: [['publishedAt', 'DESC']],
      });
      return posts;
    } catch (error) {
      console.error('Error in findByCategory:', error);
      throw error;
    }
  }

  // findByTag

  async findByTag(tag: string): Promise<InstanceType<typeof Post>[] | null> {
    try {
      const tagItem = await Tag.findOne({
        where: { slug: tag },
        include: [
          {
            model: Post,
            as: "posts",
            where: { status: 'PUBLISHED' }, // Only published posts
            required: false, // LEFT JOIN to get tag even if no posts
            include: [
              {
                model: Category,
                as: "category",
              },
              {
                model: Tag,
                as: "tags",
              },
            ],
          },
        ],
      });

      if (!tagItem) {
        console.warn(`Tag not found with slug: ${tag}`);
        return [];
      }

      // Return the posts associated with this tag
      const item = tagItem.toJSON<any>();
      return item.posts || [];
    } catch (error) {
      console.error('Error in findByTag:', error);
      throw error;
    }
  }

  /**
   * Receives a Post as parameter
   * @post
   * returns void
   */
  async create(post: IPost): Promise<InstanceType<typeof Post>> {
    // Begin transaction if needed
    const transaction = await sequelize.transaction();
    try {
      const { tags, ...rest } = post;

      const postItem = await Post.create<InstanceType<typeof Post>>(
        { ...rest },
        { transaction }
      );

      await Promise.all(
        post.tags.map((tagId) =>
          PostTag.create(
            { tagId: tagId, postId: post.id },
            {
              transaction,
              ignoreDuplicates: true,
              returning: false,
            }
          )
        )
      );
      // Commit transaction
      await transaction.commit();

      return postItem;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Post
   */
  async findById(id: string): Promise<InstanceType<typeof Post> | null> {
    try {
      const postItem = await Post.findByPk(id, {
        include: [
          { model: Tag, as: "tags" },
          { model: Category, as: "category" },
        ],
      });

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
  async getAll(): Promise<InstanceType<typeof Post>[]> {
    try {
      const posts = await Post.findAll({
        include: [
          { model: Tag, as: "tags" },
          { model: Category, as: "category" },
        ],
      });
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async findPublished(): Promise<InstanceType<typeof Post>[]> {
    try {
      const posts = await Post.findAll({
        where: { status: 'PUBLISHED' },
        include: [
          { model: Tag, as: "tags" },
          { model: Category, as: "category" },
        ],
        order: [['publishedAt', 'DESC']],
      });
      return posts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Post as parameter
   * @post
   * returns void
   */
  async update(post: IPost): Promise<InstanceType<typeof Post>> {
    const { id } = post;
    try {
      const postItem: any = await Post.findByPk(id);

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
