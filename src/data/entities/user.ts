// models/User.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";
import Event from "./event";
import Service from "./service";
import Project from "./project";
import Post from "./post";
import Banner from "./banner";

class User extends Model {
  public id!: string;
  public email!: string;
  public username!: string;
  public fullname!: string;
  public password!: string;
  public authStrategy!: string;
  public address!: string;
  public verified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public role!: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(128),
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    authStrategy: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.STRING(50),
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

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

export default User;
