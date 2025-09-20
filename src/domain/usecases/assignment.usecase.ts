import { Assignment } from "@data/entities/index";
import { IAssignmentRepository } from "@data/repositories/contracts/repository.base";
import { IAssignment } from "@domain/models/assignment.model";

export class AssignmentUseCase {
  /**
   *
   */
  constructor(
    private readonly assignmentRepository: IAssignmentRepository
  ) {}

  async createAssignment(assignment: IAssignment): Promise<InstanceType<typeof Assignment>> {
    const existingAssignment = await this.assignmentRepository.findByTitle(assignment.title);

    if (existingAssignment) {
      throw new Error("Assignment already exists");
    }

    return this.assignmentRepository.create(assignment);
  }

  async getAll(): Promise<InstanceType<typeof Assignment>[]> {
    return this.assignmentRepository.getAll();
  }

  async getAssignmentById(id: string): Promise<InstanceType<typeof Assignment> | null> {
    return this.assignmentRepository.findById(id);
  }

  async getAssignmentBySlug(slug: string): Promise<InstanceType<typeof Assignment> | null> {
    return this.assignmentRepository.findBySlug(slug);
  }

  async getAssignmentsByCourseId(courseId: string): Promise<InstanceType<typeof Assignment>[]> {
    return this.assignmentRepository.findByCourseId(courseId);
  }

  async getAssignmentsByModuleId(moduleId: string): Promise<InstanceType<typeof Assignment>[]> {
    return this.assignmentRepository.findByModuleId(moduleId);
  }

  async getAssignmentsByLessonId(lessonId: string): Promise<InstanceType<typeof Assignment>[]> {
    return this.assignmentRepository.findByLessonId(lessonId);
  }

  async updateAssignment(assignment: IAssignment): Promise<InstanceType<typeof Assignment>> {
    return this.assignmentRepository.update(assignment);
  }

  async deleteAssignment(id: string): Promise<void> {
    return this.assignmentRepository.delete(id);
  }
}
