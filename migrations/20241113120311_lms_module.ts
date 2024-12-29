import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("courses", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("slug", 500).unique().notNullable();
      table.text("description").notNullable();
      table.string("imageUrl", 500).notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table
        .string("categoryId", 10)
        .notNullable()
        .references("id")
        .inTable("categories");
      table.string("authorName").notNullable();

      table.timestamps(true, true);
    })
    .createTable("lessons", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("slug", 500).unique().notNullable();
      table.text("description").notNullable();
      table.text("content").notNullable();
      table.string("imageUrl", 500).notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table
        .string("courseId", 10)
        .notNullable()
        .references("id")
        .inTable("courses");
      table.string("authorName").notNullable();
      table.integer("duration").notNullable();
      table.string("difficulty", 128).notNullable();
      table.string("url", 255).notNullable();
      table.specificType("prerequisites", "TEXT[]").notNullable();
      table.specificType("objectives", "TEXT[]").notNullable();
      table.specificType("keywords", "TEXT[]").notNullable();
      table.string("author", 128).notNullable();

      table.specificType("reviews", "TEXT[]").nullable();
      table.string("language", 128).nullable();
      table.integer("rating").nullable();

      table.timestamps(true, true);
    })
    .createTable("quizes", function (table) {
      table.string("id", 10).primary();
      table.string("question", 500).unique().notNullable();
      table.specificType("answers", "TEXT[]").notNullable();
      table.string("slug", 500).unique().notNullable();
      table
        .string("lessonId", 10)
        .notNullable()
        .references("id")
        .inTable("lessons");
      table.integer("correctAnswerIndex").notNullable();

      table.timestamps(true, true);
    })
    .createTable("enrollments", function (table) {
      table.string("id", 10).primary();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table
        .string("courseId", 10)
        .notNullable()
        .references("id")
        .inTable("courses");
      table.timestamp("enrollmentDate").nullable();
      table.timestamp("completionDate").nullable();

      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("courses")
    .dropTable("lessons")
    .dropTable("quizes")
    .dropTable("enrollments");
}
