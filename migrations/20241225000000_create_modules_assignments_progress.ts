import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create modules table
  await knex.schema.createTable("modules", function (table) {
    table.string("id", 20).primary();
    table.string("title", 500).notNullable();
    table.string("slug", 500).notNullable();
    table.text("description").nullable();
    table.string("courseId", 20).notNullable();
    table.string("userId", 20).notNullable().comment("Module creator/instructor");
    
    // Module organization
    table.integer("module_order").notNullable().defaultTo(1).comment("Order within course");
    table.enum("status", ["draft", "published", "archived"]).notNullable().defaultTo("draft");
    
    // Learning structure
    table.text("learning_objectives").nullable();
    table.text("prerequisites").nullable();
    table.integer("estimated_duration_hours").nullable().comment("Estimated completion time in hours");
    
    // Access control
    table.boolean("is_locked").notNullable().defaultTo(false).comment("Requires previous modules completion");
    table.timestamp("unlock_date").nullable().comment("When module becomes available");
    
    // Progress tracking
    table.integer("total_lessons").notNullable().defaultTo(0);
    table.integer("total_quizzes").notNullable().defaultTo(0);
    table.integer("total_assignments").notNullable().defaultTo(0);
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index("courseId", "idx_modules_course");
    table.index("userId", "idx_modules_user");
    table.index("status", "idx_modules_status");
    table.index("module_order", "idx_modules_order");
    table.index("slug", "idx_modules_slug");
    table.index(["courseId", "module_order"], "idx_modules_course_order");
    table.index(["courseId", "status"], "idx_modules_course_status");
    
    // Foreign keys
    table.foreign("courseId").references("id").inTable("courses").onDelete("CASCADE");
    table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
  });

  // Create assignments table
  await knex.schema.createTable("assignments", function (table) {
    table.string("id", 20).primary();
    table.string("title", 500).notNullable();
    table.string("slug", 500).notNullable();
    table.text("description").notNullable();
    table.text("instructions").notNullable();
    
    // Relationships
    table.string("courseId", 20).notNullable();
    table.string("moduleId", 20).nullable().comment("Optional: assignment within specific module");
    table.string("lessonId", 20).nullable().comment("Optional: assignment for specific lesson");
    table.string("userId", 20).notNullable().comment("Assignment creator/instructor");
    
    // Assignment configuration
    table.enum("assignment_type", ["essay", "project", "practical", "presentation", "research", "coding", "design"]).notNullable().defaultTo("essay");
    table.enum("status", ["draft", "published", "archived"]).notNullable().defaultTo("draft");
    table.integer("assignment_order").notNullable().defaultTo(1).comment("Order within module/course");
    
    // Submission settings
    table.decimal("max_score", 5, 2).notNullable().defaultTo(100.00);
    table.decimal("passing_score", 5, 2).notNullable().defaultTo(50.00);
    table.integer("max_attempts").notNullable().defaultTo(3);
    table.integer("time_limit_minutes").nullable().comment("Time limit for completion");
    
    // Deadlines
    table.timestamp("available_from").nullable();
    table.timestamp("due_date").nullable();
    table.boolean("late_submission_allowed").notNullable().defaultTo(true);
    table.decimal("late_penalty_percent", 5, 2).nullable().comment("Penalty for late submission");
    
    // Submission requirements
    table.enum("submission_format", ["text", "file_upload", "url", "both_text_file"]).notNullable().defaultTo("text");
    table.string("allowed_file_types", 500).nullable().comment("Comma-separated file extensions");
    table.integer("max_file_size_mb").nullable().defaultTo(10);
    table.integer("min_word_count").nullable();
    table.integer("max_word_count").nullable();
    
    // Grading
    table.boolean("auto_grade").notNullable().defaultTo(false).comment("Automatic grading available");
    table.json("rubric").nullable().comment("Grading rubric");
    table.boolean("peer_review_enabled").notNullable().defaultTo(false);
    table.integer("peer_reviews_required").nullable();
    
    // Resources
    table.text("reference_materials").nullable();
    table.string("sample_submissions", 500).nullable();
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index("courseId", "idx_assignments_course");
    table.index("moduleId", "idx_assignments_module");
    table.index("lessonId", "idx_assignments_lesson");
    table.index("userId", "idx_assignments_user");
    table.index("status", "idx_assignments_status");
    table.index("assignment_type", "idx_assignments_type");
    table.index("due_date", "idx_assignments_due_date");
    table.index("slug", "idx_assignments_slug");
    table.index(["courseId", "moduleId"], "idx_assignments_course_module");
    table.index(["courseId", "assignment_order"], "idx_assignments_course_order");
    table.index(["moduleId", "assignment_order"], "idx_assignments_module_order");
    
    // Foreign keys
    table.foreign("courseId").references("id").inTable("courses").onDelete("CASCADE");
    table.foreign("moduleId").references("id").inTable("modules").onDelete("CASCADE");
    table.foreign("lessonId").references("id").inTable("lessons").onDelete("CASCADE");
    table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
  });

  // Create course_progress table
  await knex.schema.createTable("course_progress", function (table) {
    table.string("id", 20).primary();
    table.string("enrollmentId", 20).notNullable();
    table.string("courseId", 20).notNullable();
    table.string("userId", 20).notNullable();
    table.string("moduleId", 20).nullable();
    table.string("lessonId", 20).nullable();
    table.string("quizId", 20).nullable();
    table.string("assignmentId", 20).nullable();
    
    // Progress tracking
    table.enum("progress_type", ["lesson", "quiz", "assignment", "module", "course"]).notNullable().defaultTo("lesson");
    table.enum("status", ["not_started", "in_progress", "completed", "failed", "skipped"]).notNullable().defaultTo("not_started");
    table.integer("completion_percentage").notNullable().defaultTo(0);
    
    // Time tracking
    table.integer("time_spent_minutes").notNullable().defaultTo(0);
    table.timestamp("started_at").nullable();
    table.timestamp("completed_at").nullable();
    table.timestamp("last_accessed_at").nullable();
    
    // Assessment data
    table.decimal("score", 5, 2).nullable().comment("Score achieved (0-100)");
    table.decimal("max_score", 5, 2).nullable().comment("Maximum possible score");
    table.integer("attempts").notNullable().defaultTo(0).comment("Number of attempts made");
    table.integer("max_attempts").nullable().comment("Maximum attempts allowed");
    
    // Progress details
    table.integer("current_position").nullable().comment("Current position in video/content");
    table.integer("total_duration").nullable().comment("Total content duration in seconds");
    table.json("bookmarks").nullable().comment("User bookmarks and notes");
    table.text("notes").nullable().comment("Student notes");
    
    // Feedback and interaction
    table.enum("difficulty_rating", ["very_easy", "easy", "moderate", "hard", "very_hard"]).nullable();
    table.text("feedback").nullable().comment("Student feedback");
    table.text("instructor_feedback").nullable().comment("Instructor feedback");
    
    // System fields
    table.boolean("is_mandatory").notNullable().defaultTo(true).comment("Is this progress item mandatory for course completion");
    table.decimal("weight", 5, 2).notNullable().defaultTo(1.00).comment("Weight for overall course progress calculation");
    table.timestamps(true, true);
    
    // Indexes
    table.index("enrollmentId", "idx_course_progress_enrollment");
    table.index("courseId", "idx_course_progress_course");
    table.index("userId", "idx_course_progress_user");
    table.index("moduleId", "idx_course_progress_module");
    table.index("lessonId", "idx_course_progress_lesson");
    table.index("quizId", "idx_course_progress_quiz");
    table.index("assignmentId", "idx_course_progress_assignment");
    table.index("progress_type", "idx_course_progress_type");
    table.index("status", "idx_course_progress_status");
    table.index("completed_at", "idx_course_progress_completed");
    table.index("last_accessed_at", "idx_course_progress_last_accessed");
    table.index(["userId", "courseId"], "idx_course_progress_user_course");
    table.index(["enrollmentId", "status"], "idx_course_progress_enrollment_status");
    table.index(["courseId", "progress_type"], "idx_course_progress_course_type");
    table.index(["userId", "status", "completed_at"], "idx_course_progress_user_status");
    table.index(["moduleId", "status"], "idx_course_progress_module_status");
    
    // Unique constraint
    table.unique(["userId", "courseId", "progress_type", "moduleId", "lessonId", "quizId", "assignmentId"], "unique_user_course_item");
    
    // Foreign keys
    table.foreign("enrollmentId").references("id").inTable("course_enrollments").onDelete("CASCADE");
    table.foreign("courseId").references("id").inTable("courses").onDelete("CASCADE");
    table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("moduleId").references("id").inTable("modules").onDelete("CASCADE");
    table.foreign("lessonId").references("id").inTable("lessons").onDelete("CASCADE");
    table.foreign("quizId").references("id").inTable("quizes").onDelete("CASCADE");
    table.foreign("assignmentId").references("id").inTable("assignments").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("course_progress");
  await knex.schema.dropTableIfExists("assignments");
  await knex.schema.dropTableIfExists("modules");
}
