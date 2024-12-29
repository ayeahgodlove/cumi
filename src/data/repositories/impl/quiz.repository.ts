import { IQuiz } from "@domain/models/quiz";
import { IQuizRepository } from "../contracts/repository.base";
import Quiz from "@data/entities/quiz";
import { NotFoundException } from "@shared/exceptions/not-found.exception";


export class QuizRepository implements IQuizRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Quiz as parameter
   * @quiz
   * returns void
   */
  async create(quiz: IQuiz): Promise<Quiz> {
    try {
      return await Quiz.create<Quiz>({ ...quiz });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Quiz
   */
  async findById(id: string): Promise<Quiz | null> {
    try {
      const quizItem = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id);
      }
      return quizItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Quiz
   */
  async findByQuestion(question: string): Promise<Quiz | null> {
    try {
      const quizItem = await Quiz.findOne({ where: { question } });
      return quizItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Quiz | null> {
    try {
      const quiz = await Quiz.findOne({
        where: { slug },
      });
      return quiz;
    } catch (error) {
      throw error;
    }
  }
  /*
   * Returns an array of Quiz
   */
  async getAll(): Promise<Quiz[]> {
    try {
      const categories = await Quiz.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Quiz as parameter
   * @quiz
   * returns void
   */
  async update(quiz: IQuiz): Promise<Quiz> {
    const { id } = quiz;
    try {
      const quizItem: any = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id.toString());
      }

      return await quizItem.update({ ...quiz });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const quizItem = await Quiz.findByPk(id);

      if (!quizItem) {
        throw new NotFoundException("Quiz", id);
      }

      await quizItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
