import sequelize from "@database/db-sequelize.config";
import { DataTypes } from "sequelize";

import defineBanner from "./banner";
import defineCategory from "./category";
import defineComment from "./comment";
import defineCommentInteraction from "./comment-interaction.entity";
import definePostInteraction from "./post-interaction.entity";
import defineCourse from "./course";
import defineTag from "./tag";
import defineEvent from "./event";
import defineEventTag from "./event_tag";
import defineLesson from "./lesson";
import defineOpportunity from "./opportunity";
import definePost from "./post";
import definePostTag from "./post_tag";
import defineProfessional from "./professional";
import defineProject from "./project";
import defineQuiz from "./quiz";
import defineRole from "./role";
import defineService from "./service";
import defineUser from "./user";
import defineSubscriber from "./subscriber";
import defineContactMessage from "./contact-message";
import definePartner from "./partner";
import defineCourseEnrollment from "./course-enrollment";
import defineModule from "./module.entity";
import defineAssignment from "./assignment.entity";
import defineCourseProgress from "./course-progress.entity";

const Banner = defineBanner(sequelize, DataTypes);
const Category = defineCategory(sequelize, DataTypes);
const Comment = defineComment(sequelize, DataTypes);
const CommentInteraction = defineCommentInteraction(sequelize, DataTypes);
const PostInteraction = definePostInteraction(sequelize, DataTypes);
const Tag = defineTag(sequelize, DataTypes);
const Course = defineCourse(sequelize, DataTypes);
const Event = defineEvent(sequelize, DataTypes);
const EventTag = defineEventTag(sequelize, DataTypes);
const Post = definePost(sequelize, DataTypes);
const Lesson = defineLesson(sequelize, DataTypes);
const Opportunity = defineOpportunity(sequelize, DataTypes);
const PostTag = definePostTag(sequelize, DataTypes);
const Professional = defineProfessional(sequelize, DataTypes);
const Project = defineProject(sequelize, DataTypes);
const Quiz = defineQuiz(sequelize, DataTypes);
const Role = defineRole(sequelize, DataTypes);
const Service = defineService(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
const Subscriber = defineSubscriber(sequelize, DataTypes);
const ContactMessage = defineContactMessage(sequelize, DataTypes);
const Partner = definePartner(sequelize, DataTypes);
const CourseEnrollment = defineCourseEnrollment(sequelize, DataTypes);
const Module = defineModule(sequelize, DataTypes);
const Assignment = defineAssignment(sequelize, DataTypes);
const CourseProgress = defineCourseProgress(sequelize, DataTypes);

Event.belongsToMany(Tag, {
  through: {
    model: "event_tags",
    unique: false,
  },
  foreignKey: "eventId",
  otherKey: "tagId",
  timestamps: false,
}); // Many-to-many relationship
Tag.belongsToMany(Event, {
  through: {
    model: "event_tags",
    unique: false,
  },
  foreignKey: "tagId",
  otherKey: "eventId",
  timestamps: false,
});

Post.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Post, { foreignKey: "categoryId", as: "posts" });

Course.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Course, { foreignKey: "categoryId", as: "courses" });

Post.belongsToMany(Tag, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "postId",
  otherKey: "tagId",
  timestamps: false,
  as: "tags",
}); // Many-to-many relationship
Tag.belongsToMany(Post, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "tagId",
  otherKey: "postId",
  timestamps: false,
  as: "posts",
});

User.hasMany(Banner, { foreignKey: "userId" });
Banner.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

User.hasMany(Service, { foreignKey: "userId" });
Service.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Project, { foreignKey: "userId" });
Project.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

// Comment associations
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

// Comment Interaction associations
User.hasMany(CommentInteraction, { foreignKey: "userId", as: "commentInteractions" });
CommentInteraction.belongsTo(User, { foreignKey: "userId", as: "user" });

Comment.hasMany(CommentInteraction, { foreignKey: "commentId", as: "interactions" });
CommentInteraction.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });

// Post Interaction associations
User.hasMany(PostInteraction, { foreignKey: "userId", as: "postInteractions" });
PostInteraction.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(PostInteraction, { foreignKey: "postId", as: "interactions" });
PostInteraction.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Course associations
User.hasMany(Course, { foreignKey: "userId", as: "courses" });
Course.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Module associations
Course.hasMany(Module, { foreignKey: "courseId", as: "modules" });
Module.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Module, { foreignKey: "userId", as: "modules" });
Module.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Assignment associations
Course.hasMany(Assignment, { foreignKey: "courseId", as: "assignments" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Module.hasMany(Assignment, { foreignKey: "moduleId", as: "assignments" });
Assignment.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

Lesson.hasMany(Assignment, { foreignKey: "lessonId", as: "assignments" });
Assignment.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

User.hasMany(Assignment, { foreignKey: "userId", as: "assignments" });
Assignment.belongsTo(User, { foreignKey: "userId", as: "instructor" });

// Course Progress associations
CourseEnrollment.hasMany(CourseProgress, { foreignKey: "enrollmentId", as: "courseProgress" });
CourseProgress.belongsTo(CourseEnrollment, { foreignKey: "enrollmentId", as: "enrollment" });

Course.hasMany(CourseProgress, { foreignKey: "courseId", as: "courseProgress" });
CourseProgress.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(CourseProgress, { foreignKey: "userId", as: "courseProgress" });
CourseProgress.belongsTo(User, { foreignKey: "userId", as: "user" });

Module.hasMany(CourseProgress, { foreignKey: "moduleId", as: "courseProgress" });
CourseProgress.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

Lesson.hasMany(CourseProgress, { foreignKey: "lessonId", as: "courseProgress" });
CourseProgress.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

Quiz.hasMany(CourseProgress, { foreignKey: "quizId", as: "courseProgress" });
CourseProgress.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

Assignment.hasMany(CourseProgress, { foreignKey: "assignmentId", as: "courseProgress" });
CourseProgress.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

export {
  Banner,
  Category,
  Comment,
  CommentInteraction,
  PostInteraction,
  Course,
  Event,
  EventTag,
  Lesson,
  Opportunity,
  PostTag,
  Post,
  Professional,
  Project,
  Quiz,
  Role,
  Service,
  User,
  Tag,
  Subscriber,
  ContactMessage,
  Partner,
  CourseEnrollment,
  Module,
  Assignment,
  CourseProgress
};
