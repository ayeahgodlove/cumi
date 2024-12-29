// models/Banner.ts
import sequelize from '@database/db-sequelize.config';
import { DataTypes, Model } from 'sequelize';

class Banner extends Model {
  public id!: string;
  public title!: string;
  public subTitle!: string;
  public image!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Banner.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'banners',
    timestamps: true,
  }
);

export default Banner;
