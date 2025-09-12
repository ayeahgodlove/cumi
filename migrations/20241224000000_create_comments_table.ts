import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("comments", function (table) {
    table.string("id", 10).primary();
    table.text("content").notNullable();
    table
      .string("postId", 10)
      .notNullable()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE");
    table
      .string("userId", 10)
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .string("parentId", 10)
      .nullable()
      .references("id")
      .inTable("comments")
      .onDelete("CASCADE");
    table.boolean("is_approved").defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes for better performance
    table.index(["postId"]);
    table.index(["userId"]);
    table.index(["parentId"]);
    table.index(["is_approved"]);
    table.index(["createdAt"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("comments");
}
