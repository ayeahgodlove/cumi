// models/Service.ts
import { Model, Sequelize } from "sequelize";

const Service = (sequelize: Sequelize, DataTypes: any) => {
  const ServiceModel = sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
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
      imageUrl: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      items: {
        type: DataTypes.JSON,
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
      tableName: "services",
      timestamps: true,
    }
  );

  return ServiceModel;
};

export default Service;

