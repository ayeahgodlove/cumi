// models/EventTag.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "@database/db-sequelize.config";
import Tag from "./tag";
import Event from "./event";

class EventTag extends Model {
  public eventId!: string;
  public tagId!: string;
}

EventTag.init(
  {
    eventId: {
      type: DataTypes.STRING,
      references: {
        model: Event,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    tagId: {
      type: DataTypes.STRING,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "event_tags",
    timestamps: false, // Enable if you want to track creation or update timestamps
  }
);

export default EventTag;
