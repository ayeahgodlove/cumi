import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Add moduleId column to lessons table (this is the main missing field)
  await knex.schema.alterTable("lessons", function (table) {
    table.string("moduleId", 20).nullable().comment("Module this lesson belongs to");
    table.index("moduleId", "idx_lessons_module");
    table.foreign("moduleId").references("id").inTable("modules").onDelete("CASCADE");
  });

  // Add additional fields that are missing from the original lessons table
  await knex.schema.alterTable("lessons", function (table) {
    // Add duration_minutes field
    table.integer("duration_minutes").nullable().comment("Lesson duration in minutes");
    table.index("duration_minutes", "idx_lessons_duration");
    
    // Add lesson_order field
    table.integer("lesson_order").notNullable().defaultTo(1).comment("Order of lesson within course");
    table.index("lesson_order", "idx_lessons_order");
    
    // Add status field
    table.enum("status", ["draft", "published", "archived"]).notNullable().defaultTo("draft");
    table.index("status", "idx_lessons_status");
    
    // Add lesson_type field
    table.enum("lesson_type", ["video", "text", "audio", "practical", "discussion", "assignment"]).notNullable().defaultTo("text");
    table.index("lesson_type", "idx_lessons_type");
    
    // Add video_url field
    table.string("video_url", 500).nullable().comment("Video lesson URL");
    
    // Add audio_url field
    table.string("audio_url", 500).nullable().comment("Audio lesson URL (important for low bandwidth)");
    
    // Add download_materials field
    table.string("download_materials", 500).nullable().comment("Downloadable materials URL");
    
    // Add is_free_preview field
    table.boolean("is_free_preview").notNullable().defaultTo(false).comment("Free preview lesson");
    table.index("is_free_preview", "idx_lessons_free_preview");
    
    // Add requires_completion field
    table.boolean("requires_completion").notNullable().defaultTo(true).comment("Must complete to proceed");
    
    // Add estimated_completion_time field
    table.integer("estimated_completion_time").nullable().comment("Estimated completion time in minutes");
    
    // Add practical_examples field
    table.text("practical_examples").nullable().comment("Local/Cameroon-specific examples");
    
    // Add resources_needed field
    table.text("resources_needed").nullable().comment("Required materials or tools");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the added columns
  await knex.schema.alterTable("lessons", function (table) {
    table.dropColumn("resources_needed");
    table.dropColumn("practical_examples");
    table.dropColumn("estimated_completion_time");
    table.dropColumn("requires_completion");
    table.dropColumn("is_free_preview");
    table.dropColumn("download_materials");
    table.dropColumn("audio_url");
    table.dropColumn("video_url");
    table.dropColumn("lesson_type");
    table.dropColumn("status");
    table.dropColumn("lesson_order");
    table.dropColumn("duration_minutes");
    table.dropColumn("moduleId");
  });
}
