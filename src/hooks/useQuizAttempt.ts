import { useState, useEffect } from 'react';

interface QuizAttempt {
  id: string;
  projectId: string;
  userId: string;
  maxQuestions: number;
  duration: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  score?: number;
  totalQuestions?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseQuizAttemptReturn {
  quizAttempt: QuizAttempt | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuizAttempt(attemptId: string): UseQuizAttemptReturn {
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizAttempt = async () => {
    if (!attemptId) {
      setError('Attempt ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quiz-attempts/${attemptId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Quiz attempt not found');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        throw new Error('Failed to fetch quiz attempt');
      }

      const data = await response.json();
      setQuizAttempt(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setQuizAttempt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizAttempt();
  }, [attemptId]);

  const refetch = () => {
    fetchQuizAttempt();
  };

  return {
    quizAttempt,
    loading,
    error,
    refetch,
  };
}
