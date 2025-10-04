export interface ICommentInteraction {
  id: string;
  commentId: string;
  userId: string;
  interactionType: 'like' | 'dislike';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentInteractionStats {
  commentId: string;
  likesCount: number;
  dislikesCount: number;
  userInteraction?: 'like' | 'dislike' | null;
}

