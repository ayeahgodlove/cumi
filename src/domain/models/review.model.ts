// src/domain/models/review.model.ts

export interface IReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5 stars
  comment: string;
  wouldRecommend: boolean;
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  helpfulVotes: number;
  language: 'french' | 'english' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export const emptyReview: IReview = {
  id: "",
  userId: "",
  courseId: "",
  rating: 5,
  comment: "",
  wouldRecommend: true,
  difficulty: 'medium',
  isAnonymous: false,
  status: 'pending',
  helpfulVotes: 0,
  language: 'english',
  createdAt: new Date(),
  updatedAt: new Date(),
};
