import { DataTypes, Sequelize } from "sequelize";
import { IProfessional } from "@domain/models/professional.model";

const Professional = (sequelize: Sequelize, DataTypes: any) => {
  const ProfessionalModel = sequelize.define(
    "Professional",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      whatsappContact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      specializations: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availability: {
        type: DataTypes.STRING,
        defaultValue: "Available",
      },
      hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      projectTypes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      languages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      certifications: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      education: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portfolioImages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      testimonials: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "professionals",
      timestamps: true,
    }
  );

  return ProfessionalModel;
};

export default Professional;

