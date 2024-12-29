// models/Enrollment.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Enrollment extends Model {
  public id!: string;
  public enrollmentDate!: Date;
  public userId!: string;
  public courseId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Course",
        key: "id",
      },
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
    tableName: "enrollments",
    timestamps: true,
  }
);

export default Enrollment;
