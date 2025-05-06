// models/Opportunity.ts
import { Model, Sequelize } from "sequelize";

const Opportunity = (sequelize: Sequelize, DataTypes: any) => {
  const OpportunityModel = sequelize.define(
    "Opportunity",
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
        type: DataTypes.ENUM("job", "scholarships"),
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
      modelName: "Opportunity",
      tableName: "opportunities",
      timestamps: true,
    }
  );

  return OpportunityModel;
};
export default Opportunity;
