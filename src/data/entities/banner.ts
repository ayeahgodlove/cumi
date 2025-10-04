// models/Banner.ts
import { Sequelize } from "sequelize";

const Banner = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const BannerModel = sequelizeInstance.define(
    "Banner",
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
      subTitle: {
        type: DataTypes.STRING,
        field: 'subTitle', // Explicitly map to camelCase column name
      },
      image: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'userId', // Explicitly map to camelCase column name
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "banners",
      timestamps: true,
      underscored: true,
    }
  );

  return BannerModel;
};

export default Banner;

