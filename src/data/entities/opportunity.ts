// models/Opportunity.ts
import { Model, Sequelize } from "sequelize";

const Opportunity = (sequelize: Sequelize, DataTypes: any) => {
  const OpportunityModel = sequelize.define(
    "Opportunity",
    {
      id: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      opp_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'other',
        comment: "Type: job, scholarship, internship, fellowship, grant, other",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Requirements or qualifications for the job or scholarship",
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Deadline for the application",
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Location of the job or applicable country for scholarship",
      },
      companyOrInstitution: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'companyOrInstitution',
        comment:
          "The company offering the job or institution offering the scholarship",
      },
      contactEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'contactEmail',
        validate: {
          isEmail: true,
        },
      },
      applicationLink: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'applicationLink',
        comment: "Link to apply for the job or scholarship",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'isActive',
        comment: "Indicates if the opportunity is still active",
      },
      
      // Scholarship-specific fields
      amount: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Scholarship amount or grant value",
      },
      duration: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Duration of scholarship/internship/job",
      },
      academicLevel: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'academic_level',
        comment: "Academic level required (Undergraduate, Graduate, PhD, etc.)",
      },
      fieldOfStudy: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'field_of_study',
        comment: "Field of study requirement",
      },
      nationality: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Nationality requirements",
      },
      ageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'age_limit',
        comment: "Age limit if applicable",
      },
      
      // Job-specific fields
      salaryRange: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'salary_range',
        comment: "Salary range for job opportunities",
      },
      employmentType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'employment_type',
        comment: "Full-time, Part-time, Contract, etc.",
      },
      experienceLevel: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'experience_level',
        comment: "Entry, Mid, Senior level",
      },
      department: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Department or division",
      },
      isRemote: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'is_remote',
        comment: "Whether the job is remote",
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Required skills as JSON array",
      },
      
      // Optional image
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'imageUrl',
        comment: "Optional opportunity image",
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
      underscored: true,
    }
  );

  return OpportunityModel;
};
export default Opportunity;
