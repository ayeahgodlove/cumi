import { Sequelize } from "sequelize";

const EventRegistration = (sequelize: Sequelize, DataTypes: any) => {
  const EventRegistrationModel = sequelize.define(
    "EventRegistration",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      registrationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'registration_date',
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
        field: 'payment_status',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'payment_amount',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_method',
      },
      paymentReference: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'payment_reference',
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
      tableName: "event_registrations",
      timestamps: true,
    }
  );

  return EventRegistrationModel;
};

export default EventRegistration;

