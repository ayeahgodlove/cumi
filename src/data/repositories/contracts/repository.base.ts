import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { IEvent } from "@domain/models/event.model";
import { ILesson } from "@domain/models/lesson";
import { IMedia } from "@domain/models/media.model";
import { IOpportunity } from "@domain/models/opportunity.model";
import { IPost } from "@domain/models/post.model";
import { IProject } from "@domain/models/project.model";
import { IQuiz } from "@domain/models/quiz";
import { IRole } from "@domain/models/role.model";
import { IService } from "@domain/models/service.model";
import { ITag } from "@domain/models/tag";
import { IUser } from "@domain/models/user";

import {
  Banner,
  Category,
  Course,
  Enrollment,
  Event,
  EventTag,
  Lesson,
  Media,
  Opportunity,
  Post,
  PostTag,
  Project,
  Quiz,
  Role,
  Service,
  User,
  Tag,
} from "../../entities/index";

export interface IRepository<T, U> {
  create(category: T): Promise<U>;
  findById(id: string): Promise<U | null>;
  getAll(): Promise<U[]>;
  update(category: T): Promise<U>;
  delete(id: string): Promise<void>;
}

export interface IMediaRepository
  extends IRepository<IMedia, InstanceType<typeof Media>> {
  findByTitle(title: string): Promise<InstanceType<typeof Media> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Media> | null>;
}

export interface IPostRepository
  extends IRepository<IPost, InstanceType<typeof Post>> {
  findByTitle(title: string): Promise<InstanceType<typeof Post> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Post> | null>;
  findByCategory(category: string): Promise<InstanceType<typeof Post>[] | null>;
  findByTag(tag: string): Promise<InstanceType<typeof Post>[] | null>;
}

export interface ICourseRepository
  extends IRepository<ICourse, InstanceType<typeof Course>> {
  findByTitle(title: string): Promise<InstanceType<typeof Course> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Course> | null>;
  findByCategory(
    category: string
  ): Promise<InstanceType<typeof Course>[] | null>;
}

export interface ILessonRepository
  extends IRepository<ILesson, InstanceType<typeof Lesson>> {
  findByTitle(title: string): Promise<InstanceType<typeof Lesson> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Lesson> | null>;
}

export interface IQuizRepository
  extends IRepository<IQuiz, InstanceType<typeof Quiz>> {
  findByQuestion(question: string): Promise<InstanceType<typeof Quiz> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Quiz> | null>;
}

export interface IOpportunityRepository
  extends IRepository<IOpportunity, InstanceType<typeof Opportunity>> {
  findByTitle(title: string): Promise<InstanceType<typeof Opportunity> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Opportunity> | null>;
}

export interface ICategoryRepository
  extends IRepository<ICategory, InstanceType<typeof Category>> {
  findByName(name: string): Promise<InstanceType<typeof Category> | null>;
}

export interface IUserRepository
  extends IRepository<IUser, InstanceType<typeof User>> {
  findByUsername(username: string): Promise<InstanceType<typeof User> | null>;
}
export interface IRoleRepository
  extends IRepository<IRole, InstanceType<typeof Role>> {
  findByName(name: string): Promise<InstanceType<typeof Role> | null>;
}
export interface ITagRepository
  extends IRepository<ITag, InstanceType<typeof Tag>> {
  findByName(name: string): Promise<InstanceType<typeof Tag> | null>;
}
export interface IProjectRepository
  extends IRepository<IProject, InstanceType<typeof Project>> {
  findByTitle(title: string): Promise<InstanceType<typeof Project> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Project> | null>;
}
export interface IServiceRepository
  extends IRepository<IService, InstanceType<typeof Service>> {
  findByTitle(title: string): Promise<InstanceType<typeof Service> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Service> | null>;
}
export interface IEventRepository
  extends IRepository<IEvent, InstanceType<typeof Event>> {
  findByTitle(title: string): Promise<InstanceType<typeof Event> | null>;
  findBySlug(slug: string): Promise<InstanceType<typeof Event> | null>;
}

export interface IBannerRepository
  extends IRepository<IBanner, InstanceType<typeof Banner>> {
  findByTitle(title: string): Promise<InstanceType<typeof Banner> | null>;
}
