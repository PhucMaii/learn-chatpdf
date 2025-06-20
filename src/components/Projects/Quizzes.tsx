import React, { useState, useRef, useCallback } from 'react';
import SectionContainer from '../SectionContainer';
import Quiz from '../Quiz/Quiz';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import axios from 'axios';
import EmptyDisplay from '../EmptyDisplay';
import LoadingComponent from '../LoadingComponent';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import useLocalStorage from '../../../hooks/useLocalStorage';
import QuestionsMap from '../Quiz/QuestionsMap';

export default function Quizzes() {
  const { id: projectId }: any = useParams();
  const queryClient = useQueryClient();
  const [guestSession] = useLocalStorage('guest-session', {});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<any>({});
  const quizRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/quiz?projectId=${projectId}`);
      return res.data.data;
    },
  });

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

  const scrollToNextQuestion = useCallback((currentQuestionIndex: number) => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    const nextQuestionId = quiz?.questions?.[nextQuestionIndex]?.id;

    quizRefs.current[nextQuestionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [quiz?.questions]);

  const handleUserAnswer = (questionId: number, answer: string) => {
    const targetQuestion = quiz?.questions?.find((question: any) => question.id === questionId);
    setUserAnswer((prev: any) => ({ ...prev, [questionId]: {
      isAnswered: true,
      answer: answer,
      isCorrect: answer === targetQuestion?.correctAnswer,
    } }));
    
    // Scroll to next question after answering
    // scrollToNextQuestion(questionIndex);
  };

  return (
    <SectionContainer>
      {isLoading ? (
        <LoadingComponent />
      ) : quiz?.questions?.length === 0 || !quiz ? (
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
              {quiz?.questions?.length} questions
            </h4>
          </div>

          <div className="flex gap-4">
            {/* Quiz Content Section */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                {
                  quiz?.questions && quiz.questions.map((question: any, index: number) => (
                    <div
                      key={question.id}
                      ref={(el) => {
                        quizRefs.current[question.id] = el;
                      }}
                    >
                      <Quiz
                        question={question}
                        handleUserAnswer={(questionId: number, answer: string) => 
                          handleUserAnswer(questionId, answer)
                        }
                        userAnswer={userAnswer[question.id] || null}
                        handleNextQuestion={() => scrollToNextQuestion(index)}
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Question Numbers Grid - Sticky Sidebar */}
            <QuestionsMap
              quizRefs={quizRefs}
              quiz={quiz}
              userAnswer={userAnswer}
            />
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
