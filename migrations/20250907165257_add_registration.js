  // Migration 2: Create event_registrations and course_enrollments tables
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.up = async function(knex) {
    // Check if referenced tables exist before creating foreign keys
    const hasEventsTable = await knex.schema.hasTable('events');
    const hasUsersTable = await knex.schema.hasTable('users');
    const hasCoursesTable = await knex.schema.hasTable('courses');
  
    if (!hasEventsTable) {
      throw new Error('events table does not exist. Please run the events table migration first.');
    }
    if (!hasUsersTable) {
      throw new Error('users table does not exist. Please run the users table migration first.');
    }
    if (!hasCoursesTable) {
      throw new Error('courses table does not exist. Please run the courses table migration first.');
    }
  
    // Create event_registrations table
    await knex.schema.createTable("event_registrations", function (table) {
      table.string("id", 10).primary();
      table.string("eventId", 10).notNullable().references("id").inTable("events").onDelete("CASCADE");
      table.string("userId", 10).notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("phone", 50).notNullable();
      table.string("company", 255).nullable();
      table.text("dietaryRequirements").nullable();
      table.text("additionalNotes").nullable();
      table.timestamp("registrationDate").notNullable().defaultTo(knex.fn.now());
      table.enum("status", ["pending", "confirmed", "cancelled"]).notNullable().defaultTo("pending");
      table.enum("paymentStatus", ["pending", "paid", "refunded"]).notNullable().defaultTo("pending");
      table.decimal("paymentAmount", 10, 2).nullable();
      table.string("paymentMethod", 100).nullable();
      table.string("paymentReference", 255).nullable();
      table.timestamps(true, true);
     
      // Add unique constraint to prevent duplicate registrations
      table.unique(["eventId", "userId"]);
     
      // Add indexes for better performance
      table.index(["eventId"]);
      table.index(["userId"]);
      table.index(["status"]);
      table.index(["paymentStatus"]);
    });
  
    // Create course_enrollments table
    await knex.schema.createTable("course_enrollments", function (table) {
      table.string("id", 10).primary();
      table.string("courseId", 10).notNullable().references("id").inTable("courses").onDelete("CASCADE");
      table.string("userId", 10).notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.timestamp("enrollmentDate").notNullable().defaultTo(knex.fn.now());
      table.enum("status", ["active", "completed", "dropped", "suspended"]).notNullable().defaultTo("active");
      table.integer("progress").notNullable().defaultTo(0).checkBetween([0, 100]);
      table.timestamp("lastAccessedAt").nullable();
      table.timestamp("completedAt").nullable();
      table.boolean("certificateIssued").notNullable().defaultTo(false);
      table.string("certificateUrl", 500).nullable();
      table.text("notes").nullable();
      table.timestamps(true, true);
     
      // Add unique constraint to prevent duplicate enrollments
      table.unique(["courseId", "userId"]);
     
      // Add indexes for better performance
      table.index(["courseId"]);
      table.index(["userId"]);
      table.index(["status"]);
      table.index(["progress"]);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    // Drop tables in reverse order
    await knex.schema.dropTableIfExists("course_enrollments");
    await knex.schema.dropTableIfExists("event_registrations");
  };