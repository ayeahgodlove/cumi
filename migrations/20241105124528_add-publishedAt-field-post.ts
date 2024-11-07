import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("posts", function (table) {
    table.timestamp("published_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("posts", function (table) {
    table.dropColumn("published_at");
  });
}
