import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .table("services", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("projects", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("events", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("tags", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("categories", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("banners", function (table) {
      table.string("slug", 500).unique().notNullable();
    })
    .table("roles", function (table) {
      table.string("slug", 500).unique().notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .table("services", function (table) {
      table.dropColumn("slug");
    })
    .table("projects", function (table) {
      table.dropColumn("slug");
    })
    .table("events", function (table) {
      table.dropColumn("slug");
    })
    .table("tags", function (table) {
      table.dropColumn("slug");
    })
    .table("categories", function (table) {
      table.dropColumn("slug");
    })
    .table("banners", function (table) {
      table.dropColumn("slug");
    })
    .table("roles", function (table) {
      table.dropColumn("slug");
    });
}
