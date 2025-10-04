// models/Role.ts
import { Model, Sequelize } from "sequelize";

const Role = (sequelize: Sequelize, DataTypes: any) => {
  const RoleModel = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      tableName: "roles",
      timestamps: true,
    }
  );

  return RoleModel;
};
export default Role;

