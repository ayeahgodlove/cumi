import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("assignment_submissions", (table) => {
    table.string("id", 20).primary();
    table.string("userId", 20).notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("assignmentId", 20).notNullable().references("id").inTable("assignments").onDelete("CASCADE");
    table.string("courseId", 20).notNullable().references("id").inTable("courses").onDelete("CASCADE");
    table.string("moduleId", 20).nullable().references("id").inTable("modules").onDelete("SET NULL");
    table.string("lessonId", 20).nullable().references("id").inTable("lessons").onDelete("SET NULL");
    table.text("submission_text", "longtext").nullable();
    table.text("file_urls", "longtext").nullable().comment("JSON array of uploaded file URLs");
    table.decimal("score", 5, 2).nullable();
    table.decimal("max_score", 5, 2).notNullable();
    table.decimal("percentage", 5, 2).nullable();
    table.integer("attempt_number").notNullable().defaultTo(1);
    table.boolean("is_passed").notNullable().defaultTo(false);
    table.boolean("is_late").notNullable().defaultTo(false);
    table.decimal("late_penalty_applied", 5, 2).nullable();
    table.timestamp("submitted_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("graded_at").nullable();
    table.string("graded_by", 20).nullable().references("id").inTable("users").onDelete("SET NULL");
    table.enum("status", ["submitted", "graded", "returned", "resubmitted"]).notNullable().defaultTo("submitted");
    table.text("instructor_feedback", "longtext").nullable();
    table.text("rubric_scores", "longtext").nullable().comment("JSON object with rubric criterion scores");
    table.text("peer_review_scores", "longtext").nullable().comment("JSON array of peer review scores");
    table.decimal("plagiarism_score", 5, 2).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index(["userId", "assignmentId"], "idx_user_assignment");
    table.index(["courseId", "userId"], "idx_course_user");
    table.index(["status", "submitted_at"], "idx_status_submitted");
    table.index(["graded_by"], "idx_graded_by");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("assignment_submissions");
}
