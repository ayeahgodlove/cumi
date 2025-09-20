// src/domain/models/review.model.ts

export interface IReview {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  wouldRecommend: boolean;
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  instructorRating?: number; // 1-5 stars
  contentQuality?: number; // 1-5 stars
  valueForMoney?: number; // 1-5 stars
  completionPercentage: number; // 0-100%
  isVerifiedPurchase: boolean;
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatorNotes?: string;
  helpfulVotes: number;
  reportedCount: number;
  language: 'french' | 'english' | 'both';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const emptyReview: IReview = {
  id: "",
  userId: "",
  courseId: "",
  enrollmentId: "",
  rating: 5,
  title: "",
  comment: "",
  pros: "",
  cons: "",
  wouldRecommend: true,
  difficulty: 'medium',
  instructorRating: 5,
  contentQuality: 5,
  valueForMoney: 5,
  completionPercentage: 0,
  isVerifiedPurchase: true,
  isAnonymous: false,
  status: 'pending',
  moderatorNotes: "",
  helpfulVotes: 0,
  reportedCount: 0,
  language: 'english',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
