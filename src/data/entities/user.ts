// models/User.ts
import { Model, Sequelize } from "sequelize";

interface IUserAttributes {
  id: string;
  email: string;
  username: string;
  fullname?: string;
  password: string;
  authStrategy?: string;
  address?: string;
  role?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const User = (sequelize: Sequelize, DataTypes: any) => {
  const UserModel = sequelize.define(
    "User",
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
      tableName: "users",
      timestamps: true,
    }
  );

  return UserModel;
};

export default User;
