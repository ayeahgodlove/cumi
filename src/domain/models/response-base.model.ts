import { ValidationError } from "class-validator";
export interface IResponseBase {
  message: string | string[];
  success: boolean;
  validationErrors: string[] | ValidationError[];
}

export const emptyResponseBase: IResponseBase = {
  success: false,
  message: "",
  validationErrors: [],
};

