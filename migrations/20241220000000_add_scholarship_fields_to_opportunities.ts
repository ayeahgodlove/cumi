// Migration 1: Update opportunities table
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('opportunities', (table) => {
    // Scholarship-specific fields
    table.string('amount').nullable();
    table.string('duration').nullable();
    table.string('academic_level').nullable();
    table.string('field_of_study').nullable();
    table.string('nationality').nullable();
    table.integer('age_limit').nullable();
   
    // Job-specific fields
    table.string('salary_range').nullable();
    table.string('employment_type').nullable();
    table.string('experience_level').nullable();
    table.string('department').nullable();
    table.boolean('is_remote').defaultTo(false);
    table.json('skills').nullable(); // Store as JSON array
   
    // Update opp_type to be more specific
    table.string('opp_type').defaultTo('other').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('opportunities', (table) => {
    table.dropColumn('amount');
    table.dropColumn('duration');
    table.dropColumn('academic_level');
    table.dropColumn('field_of_study');
    table.dropColumn('nationality');
    table.dropColumn('age_limit');
    table.dropColumn('salary_range');
    table.dropColumn('employment_type');
    table.dropColumn('experience_level');
    table.dropColumn('department');
    table.dropColumn('is_remote');
    table.dropColumn('skills');
  });
}
