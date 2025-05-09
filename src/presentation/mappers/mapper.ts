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
  Project,
  Quiz,
  Role,
  Service,
  Tag,
  User,
} from "@data/entities/index";

import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { IEnrollment } from "@domain/models/enrollment";
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

export class CategoryMapper {
  toDTO(category: InstanceType<typeof Category>): ICategory {
    const entity = category.toJSON<ICategory>();
    return entity;
  }
  toDTOs(categories: InstanceType<typeof Category>[]): ICategory[] {
    const _categories = categories.map((category) => {
      const entity = category.toJSON<ICategory>();
      return entity;
    });
    return _categories;
  }
}

export class PostMapper {
  toDTO(post: InstanceType<typeof Post>): IPost {
    const entity = post.toJSON<IPost>();
    return entity;
  }
  toDTOs(posts: InstanceType<typeof Post>[]): IPost[] {
    const _posts = posts.map((post) => {
      const entity = post.toJSON<IPost>();
      return entity;
    });
    return _posts;
  }
}

export class OpportunityMapper {
  toDTO(opportunity: InstanceType<typeof Opportunity>): IOpportunity {
    const entity = opportunity.toJSON<IOpportunity>();
    return entity;
  }
  toDTOs(opportunities: InstanceType<typeof Opportunity>[]): IOpportunity[] {
    const _opportunities = opportunities.map((opportunity) => {
      const entity = opportunity.toJSON<IOpportunity>();
      return entity;
    });
    return _opportunities;
  }
}

export class TagMapper {
  toDTO(tag: InstanceType<typeof Tag>): ITag {
    const entity = tag.toJSON<ITag>();
    return entity;
  }
  toDTOs(tags: InstanceType<typeof Tag>[]): ITag[] {
    const _tags = tags.map((tag) => {
      const entity = tag.toJSON<ITag>();
      return entity;
    });
    return _tags;
  }
}

export class UserMapper {
  toDTO(user: InstanceType<typeof User>): IUser {
    const entity = user.toJSON<IUser>();
    return entity;
  }
  toDTOs(users: InstanceType<typeof User>[]): IUser[] {
    const _users = users.map((user) => {
      const entity = user.toJSON<IUser>();
      return entity;
    });
    return _users;
  }
}

export class RoleMapper {
  toDTO(role: InstanceType<typeof Role>): IRole {
    const entity = role.toJSON<IRole>();
    return entity;
  }
  toDTOs(roles: InstanceType<typeof Role>[]): IRole[] {
    const _roles = roles.map((role) => {
      const entity = role.toJSON<IRole>();
      return entity;
    });
    return _roles;
  }
}
export class ProjectMapper {
  toDTO(project: InstanceType<typeof Project>): IProject {
    const entity = project.toJSON<IProject>();
    return entity;
  }
  toDTOs(projects: InstanceType<typeof Project>[]): IProject[] {
    const _projects = projects.map((project) => {
      const entity = project.toJSON<IProject>();
      return entity;
    });
    return _projects;
  }
}
export class BannerMapper {
  toDTO(banner: InstanceType<typeof Banner>): IBanner {
    const entity = banner.toJSON<IBanner>();
    return entity;
  }
  toDTOs(banners: InstanceType<typeof Banner>[]): IBanner[] {
    const _banners = banners.map((banner) => {
      const entity = banner.toJSON<IBanner>();
      return entity;
    });
    return _banners;
  }
}

export class EventMapper {
  toDTO(event: InstanceType<typeof Event>): IEvent {
    const entity = event.toJSON<IEvent>();
    return entity;
  }
  toDTOs(events: InstanceType<typeof Event>[]): IEvent[] {
    const _events = events.map((event) => {
      const entity = event.toJSON<IEvent>();
      return entity;
    });
    return _events;
  }
}

export class ServiceMapper {
  toDTO(service: InstanceType<typeof Service>): IService {
    const entity = service.toJSON<IService>();
    return {
      ...entity,
      items: JSON.parse(service.items as any),
    };
  }
  toDTOs(services: InstanceType<typeof Service>[]): IService[] {
    const _services = services.map((service) => {
      const entity = service.toJSON<IService>();
      return {
        ...entity,
        items: JSON.parse(service.items as any),
      };
    });
    return _services;
  }
}

export class MediaMapper {
  toDTO(media: InstanceType<typeof Media>): IMedia {
    const entity = media.toJSON<IMedia>();
    return entity;
  }
  toDTOs(medias: InstanceType<typeof Media>[]): IMedia[] {
    const _medias = medias.map((media) => {
      const entity = media.toJSON<IMedia>();
      return entity;
    });
    return _medias;
  }
}

export class CourseMapper {
  toDTO(course: InstanceType<typeof Course>): ICourse {
    const entity = course.toJSON<ICourse>();
    return entity;
  }
  toDTOs(courses: InstanceType<typeof Course>[]): ICourse[] {
    const _courses = courses.map((course) => {
      const entity = course.toJSON<ICourse>();
      return entity;
    });
    return _courses;
  }
}

export class LessonMapper {
  toDTO(lesson: InstanceType<typeof Lesson>): ILesson {
    const entity = lesson.toJSON<ILesson>();
    return entity;
  }
  toDTOs(lessons: InstanceType<typeof Lesson>[]): ILesson[] {
    const _lessons = lessons.map((lesson) => {
      const entity = lesson.toJSON<ILesson>();
      return entity;
    });
    return _lessons;
  }
}

export class EnrollmentMapper {
  toDTO(enrollment: InstanceType<typeof Enrollment>): IEnrollment {
    const entity = enrollment.toJSON<IEnrollment>();
    return entity;
  }
  toDTOs(enrollments: InstanceType<typeof Enrollment>[]): IEnrollment[] {
    const _enrollments = enrollments.map((enrollment) => {
      const entity = enrollment.toJSON<IEnrollment>();
      return entity;
    });
    return _enrollments;
  }
}

export class QuizMapper {
  toDTO(quiz: InstanceType<typeof Quiz>): IQuiz {
    const entity = quiz.toJSON<IQuiz>();
    return entity;
  }
  toDTOs(quizes: InstanceType<typeof Quiz>[]): IQuiz[] {
    const _quizes = quizes.map((quiz) => {
      const entity = quiz.toJSON<IQuiz>();
      return entity;
    });
    return _quizes;
  }
}
