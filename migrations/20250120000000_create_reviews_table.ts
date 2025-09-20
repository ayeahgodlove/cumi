import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reviews", (table) => {
    table.string("id", 20).primary();
    table.string("userId", 20).notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("courseId", 10).notNullable().references("id").inTable("courses").onDelete("CASCADE");
    table.string("enrollmentId", 20).nullable().references("id").inTable("course_enrollments").onDelete("SET NULL");
    table.integer("rating").notNullable().checkBetween([1, 5]);
    table.string("title", 255).notNullable();
    table.text("comment").notNullable();
    table.text("pros").nullable();
    table.text("cons").nullable();
    table.boolean("would_recommend").notNullable().defaultTo(true);
    table.enum("difficulty", ["very_easy", "easy", "medium", "hard", "very_hard"]).nullable();
    table.integer("instructor_rating").nullable().checkBetween([1, 5]);
    table.integer("content_quality").nullable().checkBetween([1, 5]);
    table.integer("value_for_money").nullable().checkBetween([1, 5]);
    table.integer("completion_percentage").notNullable().defaultTo(0).checkBetween([0, 100]);
    table.boolean("is_verified_purchase").notNullable().defaultTo(true);
    table.boolean("is_anonymous").notNullable().defaultTo(false);
    table.enum("status", ["pending", "approved", "rejected", "flagged"]).notNullable().defaultTo("pending");
    table.text("moderator_notes").nullable();
    table.integer("helpful_votes").notNullable().defaultTo(0);
    table.integer("reported_count").notNullable().defaultTo(0);
    table.enum("language", ["french", "english", "both"]).notNullable().defaultTo("english");
    table.json("tags").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index(["courseId"]);
    table.index(["userId"]);
    table.index(["rating"]);
    table.index(["status"]);
    table.index(["created_at"]);
    
    // Unique constraint: one review per user per course
    table.unique(["userId", "courseId"], { indexName: "unique_user_course_review" });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reviews");
}
