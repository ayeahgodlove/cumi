import { Quiz } from "@data/entities/index";
import { IQuizRepository } from "@data/repositories/contracts/repository.base";
import { IQuiz } from "@domain/models/quiz";

export class QuizUseCase {
  /**
   *
   */
  constructor(
    private readonly quizRepository: IQuizRepository
  ) {}

  async createQuiz(quiz: IQuiz): Promise<InstanceType<typeof Quiz>> {
    const existingQuiz = await this.quizRepository.findByQuestion(quiz.question);

    if (existingQuiz) {
      throw new Error("Quiz already exists");
    }

    // const _quiz = new Quiz({quiz});
    //because it's already done in the Repository
    return this.quizRepository.create(quiz);
  }
 
  async getAll(): Promise<InstanceType<typeof Quiz>[]> {
    return this.quizRepository.getAll();
  }

  async getQuizById(id: string): Promise<InstanceType<typeof Quiz> | null> {
    return this.quizRepository.findById(id);
  }

  async getQuizBySlug(slug: string): Promise<InstanceType<typeof Quiz> | null> {
    return this.quizRepository.findBySlug(slug);
  }

  async updateQuiz(quiz: IQuiz): Promise<InstanceType<typeof Quiz>> {
    return this.quizRepository.update(quiz);
  }

  async deleteQuiz(id: string): Promise<void> {
    return this.quizRepository.delete(id);
  }
}
