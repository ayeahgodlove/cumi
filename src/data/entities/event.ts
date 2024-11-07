// models/Event.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";
import Tag from "./tag";

class Event extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public imageUrl!: string;
  public eventDate!: Date;
  public location!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "events",
    timestamps: true,
  }
);

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

export default Event;
