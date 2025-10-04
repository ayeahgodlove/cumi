// models/Event.ts
import { Model, Sequelize } from "sequelize";

const Event = (sequelize: Sequelize, DataTypes: any) => {
  const EventModel = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
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
      // New fields from database schema
      status: {
        type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
        defaultValue: 'draft',
        comment: 'Event publication status',
      },
      eventEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'event_end_date',
        comment: 'Event end date and time',
      },
      contactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'contact_phone',
        comment: 'Contact phone number',
      },
      contactEmail: {
        type: DataTypes.STRING(128),
        allowNull: true,
        field: 'contact_email',
        comment: 'Contact email address',
      },
      whatsappNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'whatsapp_number',
        comment: 'WhatsApp contact number',
      },
      entryFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'entry_fee',
        comment: 'Entry fee in XAF (Central African Francs)',
      },
      isFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_free',
        comment: 'Is event free (1=free, 0=paid)',
      },
      maxAttendees: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_attendees',
        comment: 'Maximum number of attendees',
      },
      currentAttendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'current_attendees',
        comment: 'Current registered attendees',
      },
      category: {
        type: DataTypes.ENUM('workshop', 'seminar', 'conference', 'training', 'meeting', 'social', 'religious', 'cultural', 'sports', 'business'),
        allowNull: true,
        comment: 'Event category',
      },
      targetAudience: {
        type: DataTypes.ENUM('students', 'professionals', 'general_public', 'youth', 'women', 'entrepreneurs', 'farmers', 'teachers'),
        allowNull: true,
        field: 'target_audience',
        comment: 'Target audience',
      },
      language: {
        type: DataTypes.ENUM('french', 'english', 'both'),
        defaultValue: 'both',
        comment: 'Event language',
      },
      region: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Cameroon region (e.g., Centre, Littoral, Nord-Ouest)',
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'City name',
      },
      registrationRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'registration_required',
        comment: 'Registration required (1=yes, 0=no)',
      },
      registrationDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'registration_deadline',
        comment: 'Registration deadline',
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Special requirements or items to bring',
      },
    },
    {
      tableName: "events",
      timestamps: true,
    }
  );

  return EventModel;
};

export default Event;

