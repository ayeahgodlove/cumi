import { DataTypes, Sequelize } from "sequelize";
import { IPartner } from "@domain/models/partner.model";

const Partner = (sequelize: Sequelize, DataTypes: any) => {
  const PartnerModel = sequelize.define(
    "Partner",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      websiteLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "partners",
      timestamps: true,
    }
  );

  return PartnerModel;
};

export default Partner;
