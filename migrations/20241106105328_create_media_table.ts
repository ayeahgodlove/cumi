import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("media_tbl", function (table) {
    table.string("id", 10).primary();
    table.string("title", 500).notNullable();
    table.string("imageUrl", 500).notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("media_tbl");
}
