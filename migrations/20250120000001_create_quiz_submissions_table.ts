import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("quiz_submissions", (table) => {
    table.string("id", 20).primary();
    table.string("userId", 20).notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("quizId", 10).notNullable().references("id").inTable("quizes").onDelete("CASCADE");
    table.string("lessonId", 10).notNullable().references("id").inTable("lessons").onDelete("CASCADE");
    table.string("courseId", 20).notNullable().references("id").inTable("courses").onDelete("CASCADE");
    table.string("moduleId", 20).nullable().references("id").inTable("modules").onDelete("SET NULL");
    table.integer("score").notNullable().defaultTo(0);
    table.integer("max_score").notNullable();
    table.decimal("percentage", 5, 2).notNullable().defaultTo(0.00);
    table.text("answers", "longtext").notNullable().comment("JSON array of user answers");
    table.text("correct_answers", "longtext").notNullable().comment("JSON array of correct answers");
    table.integer("time_spent_seconds").nullable();
    table.integer("attempt_number").notNullable().defaultTo(1);
    table.boolean("is_passed").notNullable().defaultTo(false);
    table.timestamp("submitted_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("graded_at").nullable();
    table.enum("status", ["submitted", "graded", "review"]).notNullable().defaultTo("graded");
    table.text("feedback").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index(["userId", "quizId"], "idx_user_quiz");
    table.index(["courseId", "userId"], "idx_course_user");
    table.index(["lessonId", "userId"], "idx_lesson_user");
    table.index(["submitted_at"], "idx_submitted_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("quiz_submissions");
}
