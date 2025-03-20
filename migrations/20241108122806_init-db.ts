import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema

    .createTable("users", function (table) {
      table.string("id", 10).primary();
      table.string("email", 255).unique().notNullable();
      table.string("username", 50).unique().notNullable();
      table.string("fullname", 150).unique();
      table.string("password", 255).notNullable();
      table.string("authStrategy", 50).notNullable();
      table.string("address", 255).notNullable();
      table.boolean("verified").defaultTo(false);

      table.timestamps(true, true);
    })
    .createTable("roles", function (table) {
      table.string("id", 10).primary();
      table.string("name", 50).unique().notNullable();
      table.string("slug", 500).unique().notNullable();

      table.timestamps(true, true);
    })
    .createTable("categories", function (table) {
      table.string("id", 10).primary();
      table.string("name", 50).unique().notNullable();
      table.string("slug", 500).unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable("banners", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("subTitle", 1000).notNullable();
      table.string("image", 500).notNullable();
      table.string("slug", 500).unique().notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");

      table.timestamps(true, true);
    })
    .createTable("posts", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("description", 1000).notNullable();
      table.text("content").notNullable();
      table
        .string("authorId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table.string("imageUrl", 500).notNullable();
      table.string("slug", 500).unique().notNullable();
      table.enum("status", ["DRAFT", "PUBLISHED", "REJECTED"]).notNullable();
      table
        .string("categoryId", 10)
        .notNullable()
        .references("id")
        .inTable("categories");
      table.timestamp("published_at").nullable();

      table.timestamps(true, true);
    })
    .createTable("projects", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("description", 1000).notNullable();
      table.string("imageUrl", 500).notNullable();
      table.string("githubUrl", 255).notNullable();
      table.string("deployUrl", 255).notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table.string("slug", 500).unique().notNullable();
      
      table.timestamps(true, true);
    })

    .createTable("services", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("description", 1000).notNullable();
      table.string("imageUrl", 500).notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table.string("slug", 500).unique().notNullable();

      table.timestamps(true, true);
    })
    .createTable("events", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).unique().notNullable();
      table.string("description", 1000).notNullable();
      table.string("imageUrl", 500).notNullable();
      table
        .string("userId", 10)
        .notNullable()
        .references("id")
        .inTable("users");
      table.timestamp("eventDate").notNullable();
      table.string("location", 500).notNullable();
      table.string("slug", 500).unique().notNullable();

      table.timestamps(true, true);
    })

    .createTable("tags", function (table) {
      table.string("id", 10).primary();
      table.string("name", 50).unique().notNullable();
      table.string("slug", 500).unique().notNullable();

      table.timestamps(true, true);
    }) // many-to-many relationships

    .createTable("user_roles", (table) => {
      table
        .string("userId", 10)
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");

      table
        .string("roleId", 10)
        .references("id")
        .inTable("roles")
        .onDelete("CASCADE");

      table.primary(["userId", "roleId"]);
    })

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
    })
    .createTable("media_tbl", function (table) {
      table.string("id", 10).primary();
      table.string("title", 500).notNullable();
      table.string("imageUrl", 500).notNullable();
      table.string("slug", 500).unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable("opportunities", function (table) {
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
  await knex.schema
    .dropTable("users")
    .dropTable("roles")
    .dropTable("categories")
    .dropTable("banners")
    .dropTable("posts")
    .dropTable("projects")
    .dropTable("services")
    .dropTable("events")
    .dropTable("tags")
    .dropTable("user_roles")
    .dropTable("post_tags")
    .dropTable("event_tags")
    .dropTable("media_tbl")
    .dropTable("opportunities");
}
