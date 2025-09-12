/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('post_interactions', function (table) {
    table.string('id', 10).primary();
    table.string('postId', 10).notNullable();
    table.string('userId', 10).notNullable();
    table.enum('action', ['like', 'dislike']).notNullable();
    table.timestamps(true, true);

    // Foreign key constraints
    table.foreign('postId').references('id').inTable('posts').onDelete('CASCADE');
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');

    // Unique constraint to prevent duplicate interactions
    table.unique(['postId', 'userId'], 'unique_post_user_interaction');

    // Indexes for better performance
    table.index('postId');
    table.index('userId');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('post_interactions');
}
