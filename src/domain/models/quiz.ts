
// {
//   question: "What is JavaScript?",
//   answers: ["A programming language", "A web browser", "A markup language"],
//   correctAnswerIndex: 0,
// }

import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IQuiz {
  id: string;
  question: string;
  answers: string[];
  slug: string;
  correctAnswerIndex: number;
  lessonId: string;
  userId: string;
}

export const emptyQuiz: IQuiz = {
  id: "",
  question: "",
  answers: [""],
  correctAnswerIndex: 0,
  lessonId: "",
  slug: "",
  userId: ""
};

export interface IQuizState extends IBaseState {
  readonly quizes: IQuiz[];
  readonly quiz: IQuiz;
}

export interface IQuizResponse extends IResponseBase {
  data: IQuiz;
}

export interface IQuizResponses extends IResponseBase {
  data: IQuiz[];
}
