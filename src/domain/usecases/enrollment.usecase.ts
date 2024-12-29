import Enrollment from "@data/entities/enrollment";
import { IRepository } from "@data/repositories/contracts/repository.base";
import { IEnrollment } from "@domain/models/enrollment";

export class EnrollmentUseCase {
  /**
   *
   */
  constructor(
    private readonly enrollmentRepository: IRepository<IEnrollment, Enrollment>
  ) {}

  async createEnrollment(enrollment: IEnrollment): Promise<Enrollment> {
    const existingEnrollment = await this.enrollmentRepository.findById(enrollment.userId);

    if (existingEnrollment) {
      throw new Error("User already enrolled for this course");
    }

    // const _enrollment = new Enrollment({enrollment});
    //because it's already done in the Repository
    return this.enrollmentRepository.create(enrollment);
  }

  async getAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.getAll();
  } 

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    return this.enrollmentRepository.findById(id);
  }

  async updateEnrollment(enrollment: IEnrollment): Promise<Enrollment> {
    return this.enrollmentRepository.update(enrollment);
  }

  async deleteEnrollment(id: string): Promise<void> {
    return this.enrollmentRepository.delete(id);
  }
}
