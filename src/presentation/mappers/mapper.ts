import {
  Banner,
  Category,
  Comment,
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
  Professional,
  Partner,
  Module,
  Assignment,
  CourseProgress,
} from "@data/entities/index";

import { IBanner } from "@domain/models/banner.model";
import { ICategory } from "@domain/models/category";
import { IComment } from "@domain/models/comment.model";
import { ICourse } from "@domain/models/course";
import { IEnrollment } from "@domain/models/enrollment";
import { IEvent } from "@domain/models/event.model";
import { ILesson } from "@domain/models/lesson";
import { IMedia } from "@domain/models/media.model";
import { IOpportunity } from "@domain/models/opportunity.model";
import { IPost } from "@domain/models/post.model";
import { IProfessional } from "@domain/models/professional.model";
import { IProject } from "@domain/models/project.model";
import { IQuiz } from "@domain/models/quiz";
import { IRole } from "@domain/models/role.model";
import { IService } from "@domain/models/service.model";
import { ITag } from "@domain/models/tag";
import { IUser } from "@domain/models/user";
import { IPartner } from "@domain/models/partner.model";
import { IModule } from "@domain/models/module.model";
import { IAssignment } from "@domain/models/assignment.model";
import { ICourseProgress } from "@domain/models/course-progress.model";

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
      items: JSON.parse(JSON.stringify((service as any).items as any)),
    };
  }
  toDTOs(services: InstanceType<typeof Service>[]): IService[] {
    const _services = services.map((service) => {
      const entity = service.toJSON<IService>();
      return {
        ...entity,
        items: JSON.parse(JSON.stringify((service as any).items as any)),
      }
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

export class ProfessionalMapper {
  toDTO(professional: InstanceType<typeof Professional>): IProfessional {
    const entity = professional.toJSON<IProfessional>();
    return entity;
  }
  toDTOs(professionals: InstanceType<typeof Professional>[]): IProfessional[] {
    const _professionals = professionals.map((professional) => {
      const entity = professional.toJSON<IProfessional>();
      return entity;
    });
    return _professionals;
  }
}

export class PartnerMapper {
  toDTO(partner: InstanceType<typeof Partner>): IPartner {
    const entity = partner.toJSON<IPartner>();
    return entity;
  }
  toDTOs(partners: InstanceType<typeof Partner>[]): IPartner[] {
    const _partners = partners.map((partner) => {
      const entity = partner.toJSON<IPartner>();
      return entity;
    });
    return _partners;
  }
}

export class CommentMapper {
  toDTO(comment: InstanceType<typeof Comment>): IComment {
    const entity = comment.toJSON<IComment>();
    return entity;
  }
  toDTOs(comments: InstanceType<typeof Comment>[]): IComment[] {
    const _comments = comments.map((comment) => {
      const entity = comment.toJSON<IComment>();
      return entity;
    });
    return _comments;
  }
}

export class ModuleMapper {
  toDTO(module: InstanceType<typeof Module>): IModule {
    const entity = module.toJSON<IModule>();
    return entity;
  }
  toDTOs(modules: InstanceType<typeof Module>[]): IModule[] {
    const _modules = modules.map((module) => {
      const entity = module.toJSON<IModule>();
      return entity;
    });
    return _modules;
  }
}

export class AssignmentMapper {
  toDTO(assignment: InstanceType<typeof Assignment>): IAssignment {
    const entity = assignment.toJSON<IAssignment>();
    return entity;
  }
  toDTOs(assignments: InstanceType<typeof Assignment>[]): IAssignment[] {
    const _assignments = assignments.map((assignment) => {
      const entity = assignment.toJSON<IAssignment>();
      return entity;
    });
    return _assignments;
  }
}

export class CourseProgressMapper {
  toDTO(progress: InstanceType<typeof CourseProgress>): ICourseProgress {
    const entity = progress.toJSON<ICourseProgress>();
    return entity;
  }
  toDTOs(progresses: InstanceType<typeof CourseProgress>[]): ICourseProgress[] {
    const _progresses = progresses.map((progress) => {
      const entity = progress.toJSON<ICourseProgress>();
      return entity;
    });
    return _progresses;
  }
}
