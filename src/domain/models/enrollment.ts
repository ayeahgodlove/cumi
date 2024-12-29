import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: Date;
  completionDate: Date; // get duration from course model and create a date from that values
}

export const emptyEnrollment: IEnrollment = {
  id: "",
  userId: "",
  courseId: "",
  enrollmentDate: new Date(),
  completionDate: new Date(),
};

export interface IEnrollmentState extends IBaseState {
  readonly enrollments: IEnrollment[];
  readonly enrollment: IEnrollment;
}

export interface IEnrollmentResponse extends IResponseBase {
  data: IEnrollment;
}

export interface IEnrollmentResponses extends IResponseBase {
  data: IEnrollment[];
}
