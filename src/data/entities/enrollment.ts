// models/Enrollment.ts
import { Model, Sequelize } from "sequelize";

const Enrollment = (sequelize: Sequelize, DataTypes: any) => {
  const ErollmentModel = sequelize.define(
    "Enrollment",
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
        references: { model: "users", key: "id" },
      },
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "courses", key: "id" },
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
      tableName: "enrollments",
      timestamps: true,
    }
  );

  return ErollmentModel;
};

export default Enrollment;
