import React, { useState, useRef, useCallback } from 'react';
import SectionContainer from '../SectionContainer';
import Quiz from '../Quiz/Quiz';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import EmptyDisplay from '../EmptyDisplay';
import LoadingComponent from '../LoadingComponent';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import useLocalStorage from '../../../hooks/useLocalStorage';
import QuestionsMap from '../Quiz/QuestionsMap';
import GeneratingDisplay from '../GeneratingDisplay';
import CountdownTimer from '../Quiz/CountdownTimer';
import { QuizQuestion } from '@/types/quiz';
import { DrizzleQuiz } from '@/lib/db/drizzleType';
// import { QuizQuestion } from '@/lib/db/schema';

interface IProps {
  loading: boolean;
  quizAttempt?: any;
  questions?: QuizQuestion[];
  quiz?: DrizzleQuiz;
}

export default function Quizzes({
  loading,
  quizAttempt,
  questions,
  quiz,
}: IProps) {
  const router = useRouter();
  const { id: projectId }: any = useParams();

  const queryClient = useQueryClient();
  const [guestSession] = useLocalStorage('guest-session', {});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const quizRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { mutateAsync: generateQuiz } = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const res = await axios.post(
        `/api/quiz?guestSessionId=${guestSession.sessionId}`,
        {
          projectId: Number(projectId),
        },
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', projectId] });
      toast.success('Quiz generated successfully');
      setIsGenerating(false);
    },
    onError: () => {
      toast.error('Failed to generate quiz');
      setIsGenerating(false);
    },
  });

  const scrollToNextQuestion = useCallback(
    (currentQuestionIndex: number) => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextQuestionId = questions?.[nextQuestionIndex]?.id;

      quizRefs.current[nextQuestionId!]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },
    [questions],
  );

  const handleUserAnswer = (questionId: number, answer: string) => {
    const targetQuestion = questions?.find(
      (question: any) => question.id === questionId,
    );

    setUserAnswer((prev: any) => ({
      ...prev,
      [questionId]: {
        isAnswered: true,
        answer: answer,
        isCorrect: answer === targetQuestion?.correctAnswer,
      },
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || timeUp) return;

    setIsSubmitting(true);
    try {
      const correctAnswers = questions?.filter(
        (question: any) => userAnswer[question.id]?.isCorrect,
      );
      const incorrectAnswers = questions?.filter(
        (question: any) => !userAnswer[question.id]?.isCorrect,
      );
      const skippedQuestions = questions?.filter(
        (question: any) => !userAnswer[question.id],
      );

      await axios.post('/api/quiz-attempt', {
        quizAttemptId: quizAttempt?.id,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
      });

      toast.success('Quiz submitted successfully');
      // Redirect to result page
      router.push(
        `/projects/${projectId}/quiz-attempt/${quizAttempt?.id}/result`,
      );
    } catch (error: any) {
      console.log('Something went wrong', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    setTimeUp(true);
    toast.error('Time is up! Submitting your quiz automatically.');
    await handleSubmit();
  };

  if (loading) {
    return (
      <GeneratingDisplay text="Quiz is being initialized, please give us a moment. Good things are coming..." />
    );
  }

  return (
    <SectionContainer>
      {loading ? (
        <LoadingComponent />
      ) : quizAttempt?.questions?.length === 0 || !quizAttempt ? (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <EmptyDisplay
            src={'/images/quiz.png'}
            text={'No quizzes found, create one to get started'}
            width={200}
            height={200}
          />
          <Button onClick={() => generateQuiz()} disabled={isGenerating}>
            <h6 className="text-lg font-medium">
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </h6>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-2xl font-semibold justify-center">
              {quiz?.title}
            </h1>
            <h4 className="text-sm font-medium text-gray-600">
              {questions?.length} questions
            </h4>
          </div>

          <div className="flex gap-4">
            {/* Quiz Content Section */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                {questions &&
                  questions.map((question: any, index: number) => (
                    <div
                      key={question.id}
                      ref={(el) => {
                        quizRefs.current[question.id] = el;
                      }}
                    >
                      <Quiz
                        index={index + 1}
                        question={question}
                        handleUserAnswer={(
                          questionId: number,
                          answer: string,
                        ) => handleUserAnswer(questionId, answer)}
                        userAnswer={userAnswer[question.id] || null}
                        handleNextQuestion={() => scrollToNextQuestion(index)}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="default"
                  className="text-lg font-semibold py-2 px-8"
                  onClick={handleSubmit}
                  disabled={isSubmitting || timeUp}
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : timeUp
                      ? 'Time Up!'
                      : 'Submit'}
                </Button>
              </div>
            </div>

            {/* Sticky Sidebar with Countdown Timer and Questions Map */}
            <div className="flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                {/* Countdown Timer */}
                <CountdownTimer
                  timeLimit={quizAttempt?.quizDuration || 1800} // Default 30 minutes (1800 seconds)
                  startedAt={quizAttempt?.startedAt || new Date().toISOString()}
                  onTimeUp={handleTimeUp}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
                
                {/* Questions Map */}
                <QuestionsMap
                  quizRefs={quizRefs}
                  questions={questions}
                  userAnswer={userAnswer}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
