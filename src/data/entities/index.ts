import sequelize from "@database/db-sequelize.config";
import { DataTypes } from "sequelize";

import defineBanner from "./banner";
import defineCategory from "./category";
import defineCourse from "./course";
import defineTag from "./tag";
import defineEnrollment from "./enrollment";
import defineEvent from "./event";
import defineEventTag from "./event_tag";
import defineLesson from "./lesson";
import defineMedia from "./media";
import defineOpportunity from "./opportunity";
import definePost from "./post";
import definePostTag from "./post_tag";
import defineProfessional from "./professional";
import defineProject from "./project";
import defineQuiz from "./quiz";
import defineRole from "./role";
import defineService from "./service";
import defineUser from "./user";

const Banner = defineBanner(sequelize, DataTypes);
const Category = defineCategory(sequelize, DataTypes);
const Tag = defineTag(sequelize, DataTypes);
const Course = defineCourse(sequelize, DataTypes);
const Enrollment = defineEnrollment(sequelize, DataTypes);
const Event = defineEvent(sequelize, DataTypes);
const EventTag = defineEventTag(sequelize, DataTypes);
const Post = definePost(sequelize, DataTypes);
const Lesson = defineLesson(sequelize, DataTypes);
const Media = defineMedia(sequelize, DataTypes);
const Opportunity = defineOpportunity(sequelize, DataTypes);
const PostTag = definePostTag(sequelize, DataTypes);
const Professional = defineProfessional(sequelize, DataTypes);
const Project = defineProject(sequelize, DataTypes);
const Quiz = defineQuiz(sequelize, DataTypes);
const Role = defineRole(sequelize, DataTypes);
const Service = defineService(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);

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

export {
  Banner,
  Category,
  Course,
  Enrollment,
  Event,
  EventTag,
  Lesson,
  Media,
  Opportunity,
  PostTag,
  Post,
  Professional,
  Project,
  Quiz,
  Role,
  Service,
  User,
  Tag
};
