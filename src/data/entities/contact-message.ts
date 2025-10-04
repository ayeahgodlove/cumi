import { Model, Sequelize } from "sequelize";

interface IContactMessageAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessage = (sequelize: Sequelize, DataTypes: any) => {
  const ContactMessageModel = sequelize.define(
    "ContactMessage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_read",
      },
      repliedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "replied_at",
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
      tableName: "contact_messages",
      timestamps: true,
    }
  );

  return ContactMessageModel;
};

export default ContactMessage;

