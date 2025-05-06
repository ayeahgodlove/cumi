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
      },
      image: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
  );

  return BannerModel;
};

export default Banner;
