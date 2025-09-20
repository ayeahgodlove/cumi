// src/data/entities/assignment-submission.ts

import { Sequelize } from "sequelize";

const AssignmentSubmission = (sequelize: Sequelize, DataTypes: any) => {
  const AssignmentSubmissionModel = sequelize.define(
    "AssignmentSubmission",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      assignmentId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "assignments",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      moduleId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "modules",
          key: "id",
        },
      },
      lessonId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "lessons",
          key: "id",
        },
      },
      submissionText: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: "submission_text",
        comment: "Text content of the submission",
      },
      fileUrls: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: "file_urls",
        comment: "JSON array of uploaded file URLs",
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: "Points scored by the user",
      },
      maxScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: "max_score",
        comment: "Maximum possible points",
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: "Percentage score (0-100)",
      },
      attemptNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: "attempt_number",
        comment: "Which attempt this is (1st, 2nd, etc.)",
      },
      isPassed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_passed",
        comment: "Whether the user passed the assignment",
      },
      isLate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_late",
        comment: "Whether the submission was late",
      },
      latePenaltyApplied: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: "late_penalty_applied",
        comment: "Penalty applied for late submission",
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "submitted_at",
        comment: "When the assignment was submitted",
      },
      gradedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "graded_at",
        comment: "When the assignment was graded",
      },
      gradedBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "graded_by",
        references: {
          model: "users",
          key: "id",
        },
        comment: "userId of grader/instructor",
      },
      status: {
        type: DataTypes.ENUM('submitted', 'graded', 'returned', 'resubmitted'),
        allowNull: false,
        defaultValue: 'submitted',
        comment: "Status of the submission",
      },
      instructorFeedback: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: "instructor_feedback",
        comment: "Detailed instructor feedback",
      },
      rubricScores: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: "rubric_scores",
        comment: "JSON object with rubric criterion scores",
      },
      peerReviewScores: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: "peer_review_scores",
        comment: "JSON array of peer review scores",
      },
      plagiarismScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: "plagiarism_score",
        comment: "Plagiarism detection score (0-100)",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      tableName: "assignment_submissions",
      timestamps: true,
      indexes: [
        {
          fields: ["userId", "assignmentId"],
          name: "idx_user_assignment",
        },
        {
          fields: ["courseId", "userId"],
          name: "idx_course_user",
        },
        {
          fields: ["status", "submittedAt"],
          name: "idx_status_submitted",
        },
        {
          fields: ["gradedBy"],
          name: "idx_graded_by",
        },
      ],
    }
  );

  return AssignmentSubmissionModel;
};

export default AssignmentSubmission;
