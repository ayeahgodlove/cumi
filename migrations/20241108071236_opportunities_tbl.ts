import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("opportunities", function (table) {
    table.string("id", 10).primary().notNullable();
    table.string("title", 1000).notNullable();
    table
      .enum("opp_type", ["job", "scholarships"])
      .notNullable()
      .comment("Defines if the opportunity is a job or a scholarship");
    table.text("description").notNullable();
    table
      .text("requirements")
      .notNullable()
      .comment("Requirements or qualifications for the job or scholarship");
    table
      .date("deadline")
      .nullable()
      .comment("Deadline for the application");
    table.string("location", 255).notNullable();
    table.string("companyOrInstitution", 500).notNullable();
    table.string("contactEmail", 255).notNullable();
    table.string("applicationLink", 255).notNullable();
    table.boolean("isActive").defaultTo(false);
    table.string("slug", 500).unique().notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("opportunities");
}
