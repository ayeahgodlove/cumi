import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("contact_messages", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("phone", 50).nullable();
      table.string("subject", 500).notNullable();
      table.text("message").notNullable();
      table.boolean("isRead").defaultTo(false);
      table.timestamp("repliedAt").nullable();
      table.timestamps(true, true);
    })
    .createTable("subscribers", function (table) {
      table.increments("id").primary();
      table.string("email", 255).unique().notNullable();
      table.string("name", 255).nullable();
      table.boolean("isActive").defaultTo(true);
      table.timestamp("subscribedAt").defaultTo(knex.fn.now());
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("contact_messages")
    .dropTable("subscribers");
}
