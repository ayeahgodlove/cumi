import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create post_interactions table
  await knex.schema.createTable("post_interactions", function (table) {
    table.string("id", 10).primary().comment("Primary key for post interactions");
    
    table.string("postId", 10).notNullable().comment("Reference to post");
    table.index("postId", "idx_post_interactions_post");
    table.foreign("postId").references("id").inTable("posts").onDelete("CASCADE");
    
    table.string("userId", 10).notNullable().comment("Reference to user");
    table.index("userId", "idx_post_interactions_user");
    table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
    
    table.enum("action", ["like", "dislike"]).notNullable().comment("User interaction type");
    table.index("action", "idx_post_interactions_action");
    
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    
    // Unique constraint to prevent duplicate interactions from same user on same post
    table.unique(["postId", "userId"], "unique_post_user_interaction");
    
    // Composite indexes for better query performance
    table.index(["postId", "action"], "idx_post_interactions_post_action");
    table.index(["userId", "action"], "idx_post_interactions_user_action");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("post_interactions");
}
