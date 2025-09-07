import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@database/db-sequelize.config";
import { IEventRegistration } from "@domain/models/event-registration.model";

export interface EventRegistrationCreationAttributes extends Optional<IEventRegistration, 'id' | 'createdAt' | 'updatedAt'> {}

export class EventRegistrationEntity extends Model<IEventRegistration, EventRegistrationCreationAttributes> implements IEventRegistration {
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

EventRegistrationEntity.init(
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

export default EventRegistrationEntity;
