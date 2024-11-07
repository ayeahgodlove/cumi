import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("media_tbl", function (table) {
    table.string("slug", 500).unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("media_tbl", function (table) {
    table.dropColumn("slug");
  });
}
