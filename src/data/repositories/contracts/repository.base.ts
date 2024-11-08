import Banner from "@data/entities/banner";
import Category from "@data/entities/category";
import Event from "@data/entities/event";
import Media from "@data/entities/media";
import Opportunity from "@data/entities/opportunity";
import Post from "@data/entities/post";
import Project from "@data/entities/project";
import Role from "@data/entities/role";
import Service from "@data/entities/service";
import Tag from "@data/entities/tag";
import User from "@data/entities/user";
import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { IEvent } from "@domain/models/event.model";
import { IMedia } from "@domain/models/media.model";
import { IOpportunity } from "@domain/models/opportunity.model";
import { IPost } from "@domain/models/post.model";
import { IProject } from "@domain/models/project.model";
import { IRole } from "@domain/models/role.model";
import { IService } from "@domain/models/service.model";
import { ITag } from "@domain/models/tag";
import { IUser } from "@domain/models/user";

export interface IRepository<T, U> {
  create(category: T): Promise<U>;
  findById(id: string): Promise<U | null>;
  getAll(): Promise<U[]>;
  update(category: T): Promise<U>;
  delete(id: string): Promise<void>;
}

export interface IMediaRepository extends IRepository<IMedia, Media> {
  findByTitle(title: string): Promise<Media | null>;
  findBySlug(slug: string): Promise<Media | null>;
}

export interface IPostRepository extends IRepository<IPost, Post> {
  findByTitle(title: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findByCategory(category: string): Promise<Post[] | null>;
  findByTag(tag: string): Promise<Post[] | null>;
}

export interface IOpportunityRepository
  extends IRepository<IOpportunity, Opportunity> {
  findByTitle(title: string): Promise<Opportunity | null>;
  findBySlug(slug: string): Promise<Opportunity | null>;
}

export interface ICategoryRepository extends IRepository<ICategory, Category> {
  findByName(name: string): Promise<Category | null>;
}

export interface IUserRepository extends IRepository<IUser, User> {
  findByName(name: string): Promise<User | null>;
}
export interface IRoleRepository extends IRepository<IRole, Role> {
  findByName(name: string): Promise<Role | null>;
}
export interface ITagRepository extends IRepository<ITag, Tag> {
  findByName(name: string): Promise<Tag | null>;
}
export interface IProjectRepository extends IRepository<IProject, Project> {
  findByTitle(title: string): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
}
export interface IServiceRepository extends IRepository<IService, Service> {
  findByTitle(title: string): Promise<Service | null>;
  findBySlug(slug: string): Promise<Service | null>;
}
export interface IEventRepository extends IRepository<IEvent, Event> {
  findByTitle(title: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
}

export interface IBannerRepository extends IRepository<IBanner, Banner> {
  findByTitle(title: string): Promise<Banner | null>;
}
