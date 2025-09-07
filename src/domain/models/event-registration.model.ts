import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@database/db-sequelize.config";

export interface IEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  dietaryRequirements?: string;
  additionalNotes?: string;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistrationCreationAttributes extends Optional<IEventRegistration, 'id' | 'createdAt' | 'updatedAt'> {}

export class EventRegistration extends Model<IEventRegistration, EventRegistrationCreationAttributes> implements IEventRegistration {
  public id!: string;
  public eventId!: string;
  public userId!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public company?: string;
  public dietaryRequirements?: string;
  public additionalNotes?: string;
  public registrationDate!: Date;
  public status!: 'pending' | 'confirmed' | 'cancelled';
  public paymentStatus!: 'pending' | 'paid' | 'refunded';
  public paymentAmount?: number;
  public paymentMethod?: string;
  public paymentReference?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventRegistration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dietaryRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additionalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'event_registrations',
    timestamps: true,
  }
);

export const emptyEventRegistration: Partial<IEventRegistration> = {
  eventId: '',
  userId: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  dietaryRequirements: '',
  additionalNotes: '',
  registrationDate: new Date(),
  status: 'pending',
  paymentStatus: 'pending',
  paymentAmount: 0,
  paymentMethod: '',
  paymentReference: '',
};
