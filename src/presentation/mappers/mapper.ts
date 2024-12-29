import Banner from "@data/entities/banner";
import Category from "@data/entities/category";
import Course from "@data/entities/course";
import Enrollment from "@data/entities/enrollment";
import Event from "@data/entities/event";
import Lesson from "@data/entities/lesson";
import Media from "@data/entities/media";
import Opportunity from "@data/entities/opportunity";
import Post from "@data/entities/post";
import Project from "@data/entities/project";
import Quiz from "@data/entities/quiz";
import Role from "@data/entities/role";
import Service from "@data/entities/service";
import Tag from "@data/entities/tag";
import User from "@data/entities/user";
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
  toDTO(category: Category): ICategory {
    const entity = category.toJSON<ICategory>();
    return entity;
  }
  toDTOs(categories: Category[]): ICategory[] {
    const _categories = categories.map((category) => {
      const entity = category.toJSON<ICategory>();
      return entity;
    });
    return _categories;
  }
}

export class PostMapper {
  toDTO(post: Post): IPost {
    const entity = post.toJSON<IPost>();
    return entity;
  }
  toDTOs(posts: Post[]): IPost[] {
    const _posts = posts.map((post) => {
      const entity = post.toJSON<IPost>();
      return entity;
    });
    return _posts;
  }
}

export class OpportunityMapper {
  toDTO(opportunity: Opportunity): IOpportunity {
    const entity = opportunity.toJSON<IOpportunity>();
    return entity;
  }
  toDTOs(opportunitys: Opportunity[]): IOpportunity[] {
    const _opportunities = opportunitys.map((opportunity) => {
      const entity = opportunity.toJSON<IOpportunity>();
      return entity;
    });
    return _opportunities;
  }
}

export class TagMapper {
  toDTO(tag: Tag): ITag {
    const entity = tag.toJSON<ITag>();
    return entity;
  }
  toDTOs(tags: Tag[]): ITag[] {
    const _tags = tags.map((tag) => {
      const entity = tag.toJSON<ITag>();
      return entity;
    });
    return _tags;
  }
}

export class UserMapper {
  toDTO(user: User): IUser {
    const entity = user.toJSON<IUser>();
    return entity;
  }
  toDTOs(users: User[]): IUser[] {
    const _users = users.map((user) => {
      const entity = user.toJSON<IUser>();
      return entity;
    });
    return _users;
  }
}

export class RoleMapper {
  toDTO(role: Role): IRole {
    const entity = role.toJSON<IRole>();
    return entity;
  }
  toDTOs(roles: Role[]): IRole[] {
    const _roles = roles.map((role) => {
      const entity = role.toJSON<IRole>();
      return entity;
    });
    return _roles;
  }
}
export class ProjectMapper {
  toDTO(project: Project): IProject {
    const entity = project.toJSON<IProject>();
    return entity;
  }
  toDTOs(projects: Project[]): IProject[] {
    const _projects = projects.map((project) => {
      const entity = project.toJSON<IProject>();
      return entity;
    });
    return _projects;
  }
}
export class BannerMapper {
  toDTO(banner: Banner): IBanner {
    const entity = banner.toJSON<IBanner>();
    return entity;
  }
  toDTOs(banners: Banner[]): IBanner[] {
    const _banners = banners.map((banner) => {
      const entity = banner.toJSON<IBanner>();
      return entity;
    });
    return _banners;
  }
}

export class EventMapper {
  toDTO(event: Event): IEvent {
    const entity = event.toJSON<IEvent>();
    return entity;
  }
  toDTOs(events: Event[]): IEvent[] {
    const _events = events.map((event) => {
      const entity = event.toJSON<IEvent>();
      return entity;
    });
    return _events;
  }
}

export class ServiceMapper {
  toDTO(service: Service): IService {
    const entity = service.toJSON<IService>();
    return entity;
  }
  toDTOs(services: Service[]): IService[] {
    const _services = services.map((service) => {
      const entity = service.toJSON<IService>();
      return entity;
    });
    return _services;
  }
}

export class MediaMapper {
  toDTO(media: Media): IMedia {
    const entity = media.toJSON<IMedia>();
    return entity;
  }
  toDTOs(medias: Media[]): IMedia[] {
    const _medias = medias.map((media) => {
      const entity = media.toJSON<IMedia>();
      return entity;
    });
    return _medias;
  }
}

export class CourseMapper {
  toDTO(course: Course): ICourse {
    const entity = course.toJSON<ICourse>();
    return entity;
  }
  toDTOs(courses: Course[]): ICourse[] {
    const _courses = courses.map((course) => {
      const entity = course.toJSON<ICourse>();
      return entity;
    });
    return _courses;
  }
}

export class LessonMapper {
  toDTO(lesson: Lesson): ILesson {
    const entity = lesson.toJSON<ILesson>();
    return entity;
  }
  toDTOs(lessons: Lesson[]): ILesson[] {
    const _lessons = lessons.map((lesson) => {
      const entity = lesson.toJSON<ILesson>();
      return entity;
    });
    return _lessons;
  }
}

export class EnrollmentMapper {
  toDTO(enrollment: Enrollment): IEnrollment {
    const entity = enrollment.toJSON<IEnrollment>();
    return entity;
  }
  toDTOs(enrollments: Enrollment[]): IEnrollment[] {
    const _enrollments = enrollments.map((enrollment) => {
      const entity = enrollment.toJSON<IEnrollment>();
      return entity;
    });
    return _enrollments;
  }
}

export class QuizMapper {
  toDTO(quiz: Quiz): IQuiz {
    const entity = quiz.toJSON<IQuiz>();
    return entity;
  }
  toDTOs(quizes: Quiz[]): IQuiz[] {
    const _quizes = quizes.map((quiz) => {
      const entity = quiz.toJSON<IQuiz>();
      return entity;
    });
    return _quizes;
  }
}
