// models/EventTag.ts
import { Sequelize } from "sequelize";

const EventTag = (sequelize: Sequelize, DataTypes: any) => {
  const EventTagModel = sequelize.define(
    "EventTag",
    {
      eventId: {
        type: DataTypes.STRING,
        references: { model: "events", key: "id" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      tagId: {
        type: DataTypes.STRING,
        references: { model: "tags", key: "id" },
        allowNull: false,
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "event_tags",
      timestamps: false,
    }
  );

  return EventTagModel;
};

export default EventTag;

