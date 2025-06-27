export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_blank'
  | 'short_answer'
  | 'matching'
  | 'essay';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuizStatus = 'draft' | 'published' | 'archived';

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  projectId: number;
  userId?: string;
  guestId?: string;
  status: QuizStatus;
  timeLimit?: number; // in minutes
  totalQuestions: number;
  passingScore: number; // percentage
  allowRetakes: number; // 1 = true, 0 = false
  maxRetakes: number;
  shuffleQuestions: number; // 1 = true, 0 = false
  showCorrectAnswers: number; // 1 = true, 0 = false
  showResults: number; // 1 = true, 0 = false
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  points: number;
  orderIndex: number;
  explanation?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  options?: QuizQuestionOption[];
  correctAnswer?: string;
}

export interface QuizQuestionOption {
  id: number;
  questionId: number;
  optionText: string;
  isCorrect: number; // 1 = correct, 0 = incorrect
  orderIndex: number;
  explanation?: string;
  createdAt: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId?: string;
  guestId?: string;
  attemptNumber: number;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: number; // 1 = passed, 0 = failed
  timeSpent?: number; // in seconds
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface QuizResponse {
  id: number;
  attemptId: number;
  questionId: number;
  selectedOptions?: string; // JSON array of option IDs
  textAnswer?: string;
  isCorrect: number; // 1 = correct, 0 = incorrect
  pointsEarned: number;
  timeSpent?: number; // time spent on this question in seconds
  createdAt: string;
}

export interface QuizCategory {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  userId?: string;
  guestId?: string;
  createdAt: string;
}

export interface QuizCategoryRelation {
  id: number;
  quizId: number;
  categoryId: number;
  createdAt: string;
}

// Extended interfaces for API responses
export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
  categories?: QuizCategory[];
}

export interface QuizAttemptWithResponses extends QuizAttempt {
  responses: QuizResponse[];
  quiz?: Quiz;
}

export interface QuizQuestionWithOptions extends QuizQuestion {
  options: QuizQuestionOption[];
}

// Request interfaces for API calls
export interface CreateQuizRequest {
  title: string;
  description?: string;
  projectId: number;
  timeLimit?: number;
  passingScore?: number;
  allowRetakes?: boolean;
  maxRetakes?: number;
  shuffleQuestions?: boolean;
  showCorrectAnswers?: boolean;
  showResults?: boolean;
  categoryIds?: number[];
}

export interface CreateQuestionRequest {
  quizId: number;
  questionText: string;
  questionType: QuestionType;
  difficulty?: DifficultyLevel;
  points?: number;
  orderIndex: number;
  explanation?: string;
  imageUrl?: string;
  options?: CreateQuestionOptionRequest[];
}

export interface CreateQuestionOptionRequest {
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
  explanation?: string;
}

export interface SubmitQuizAttemptRequest {
  quizId: number;
  responses: SubmitQuizResponseRequest[];
  timeSpent?: number;
}

export interface SubmitQuizResponseRequest {
  questionId: number;
  selectedOptions?: number[]; // for multiple choice
  textAnswer?: string; // for text-based questions
  timeSpent?: number;
}

// Utility types
export interface QuizStats {
  totalQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  mostDifficultQuestion?: number;
  mostAnsweredQuestion?: number;
}

export interface UserQuizProgress {
  quizId: number;
  bestScore: number;
  attemptsCount: number;
  lastAttemptDate?: string;
  passed: boolean;
  timeSpent: number;
}

// Form validation schemas (for Zod)
export const quizValidationSchema = {
  title: { min: 1, max: 255 },
  description: { max: 1000 },
  timeLimit: { min: 1, max: 480 }, // 1 minute to 8 hours
  passingScore: { min: 0, max: 100 },
  maxRetakes: { min: 0, max: 10 },
} as const;

export const questionValidationSchema = {
  questionText: { min: 1, max: 2000 },
  points: { min: 1, max: 100 },
  orderIndex: { min: 1 },
} as const;

export const optionValidationSchema = {
  optionText: { min: 1, max: 500 },
  orderIndex: { min: 1 },
} as const;
