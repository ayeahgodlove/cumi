// models/Media.ts
import sequelize from '@database/db-sequelize.config';
import { DataTypes, Model } from 'sequelize';

class Media extends Model {
  public id!: string;
  public title!: string;
  public slug!: string;
  public imageUrl!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Media.init(
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
 
    imageUrl: {
      type: DataTypes.STRING,
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
    tableName: 'media_tbl',
    timestamps: true,
  }
);

export default Media;
