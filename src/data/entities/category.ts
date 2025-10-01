// models/Category.ts
import { Sequelize } from "sequelize";

const Category = (sequelize: Sequelize, DataTypes: any) => {
  const CategoryModel = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      tableName: "categories",
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization
  CategoryModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return CategoryModel;
};

export default Category;
