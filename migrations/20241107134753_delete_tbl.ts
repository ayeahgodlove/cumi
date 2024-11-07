import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("post_tags", function (table) {
      table.increments("id").primary().notNullable();
      table.string("tagId", 10).notNullable();
      table.string("postId", 10).notNullable();
      table
        .foreign("tagId")
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE");
      table
        .foreign("postId")
        .references("id")
        .inTable("posts")
        .onDelete("CASCADE");
    })
    .createTable("event_tags", function (table) {
      table.increments("id").primary().notNullable();
      table.string("tagId", 10).notNullable();
      table.string("eventId", 10).notNullable();
      table
        .foreign("tagId")
        .references("id")
        .inTable("tags")
        .onDelete("CASCADE");
      table
        .foreign("eventId")
        .references("id")
        .inTable("events")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("post_tags").dropTable("event_tags");
}
