import { IRepository } from "@data/repositories/contracts/repository.base";
import { IEnrollment } from "@domain/models/enrollment";
import { Enrollment } from "@data/entities/index";

export class EnrollmentUseCase {
  /**
   *
   */
  constructor(
    private readonly enrollmentRepository: IRepository<IEnrollment, InstanceType<typeof Enrollment>>
  ) {}

  async createEnrollment(enrollment: IEnrollment): Promise<InstanceType<typeof Enrollment>> {
    const existingEnrollment = await this.enrollmentRepository.findById(enrollment.userId);

    if (existingEnrollment) {
      throw new Error("User already enrolled for this course");
    }

    // const _enrollment = new Enrollment({enrollment});
    //because it's already done in the Repository
    return this.enrollmentRepository.create(enrollment);
  }

  async getAll(): Promise<InstanceType<typeof Enrollment>[]> {
    return this.enrollmentRepository.getAll();
  } 

  async getEnrollmentById(id: string): Promise<InstanceType<typeof Enrollment> | null> {
    return this.enrollmentRepository.findById(id);
  }

  async updateEnrollment(enrollment: IEnrollment): Promise<InstanceType<typeof Enrollment>> {
    return this.enrollmentRepository.update(enrollment);
  }

  async deleteEnrollment(id: string): Promise<void> {
    return this.enrollmentRepository.delete(id);
  }
}
