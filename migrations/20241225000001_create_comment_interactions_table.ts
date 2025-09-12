import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comment_interactions', (table) => {
    table.string('id', 20).primary();
    table.string('commentId', 20).notNullable();
    table.string('userId', 20).notNullable();
    table.enum('interactionType', ['like', 'dislike']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign key constraints
    table.foreign('commentId').references('id').inTable('comments').onDelete('CASCADE');
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    
    // Unique constraint to prevent duplicate interactions
    table.unique(['commentId', 'userId']);
    
    // Indexes for better performance
    table.index(['commentId']);
    table.index(['userId']);
    table.index(['interactionType']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('comment_interactions');
}
