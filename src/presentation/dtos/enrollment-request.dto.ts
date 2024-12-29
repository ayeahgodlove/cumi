// src/presentation/dtos/enrollment-request.dto.ts

import { emptyEnrollment, IEnrollment } from "@domain/models/enrollment";
import { IsNotEmpty, IsString, IsDate } from "class-validator";
import { nanoid } from "nanoid";


export class EnrollmentRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  constructor(data: IEnrollment) {
    this.userId = data.userId;
    this.courseId = data.courseId;
  }

  toData(): IEnrollment {
    return {
      ...emptyEnrollment,
      id: nanoid(10),
      userId: this.userId,
      courseId: this.courseId,
    };
  }

  toUpdateData(data: IEnrollment): IEnrollment {
    return {
      id: data.id,
      userId: data.userId,
      courseId: data.courseId,
      completionDate: data.completionDate,
      enrollmentDate: data.enrollmentDate,
    };
  }
}
