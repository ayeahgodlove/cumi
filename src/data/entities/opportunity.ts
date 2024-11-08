// models/Opportunity.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Opportunity extends Model {
  public id!: string;
  public title!: string;
  public type!: string;
  public slug!: string;
  public description!: string;
  public requirements!: string;
  public deadline!: Date;
  public location!: string;
  public companyOrInstitution!: string;
  public contactEmail!: string;
  public applicationLink!: string;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Opportunity.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    opp_type: {
      type: DataTypes.ENUM("job", "scholarship"),
      allowNull: false,
      comment: "Defines if the opportunity is a job or a scholarship",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Requirements or qualifications for the job or scholarship",
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Deadline for the application",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Location of the job or applicable country for scholarship",
    },
    companyOrInstitution: {
      type: DataTypes.STRING,
      allowNull: true,
      comment:
        "The company offering the job or institution offering the scholarship",
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    applicationLink: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Link to apply for the job or scholarship",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indicates if the opportunity is still active",
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
    modelName: "Opportunity",
    tableName: "opportunities",
    timestamps: true,
  }
);

export default Opportunity;
