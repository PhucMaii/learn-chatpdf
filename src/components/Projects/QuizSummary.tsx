'use client';
import React, { useEffect } from 'react';
import SectionContainer from '../SectionContainer';
import GeneratingDisplay from '../GeneratingDisplay';
import { Button } from '../ui/button';
import GradientDiv from '../GradientDiv';
import LineChart from '../Chart/LineChart';
import QuizzesTable from '../Tables/QuizzesTable';
import StartTestDialog from '../Dialogs/StartTestDialog';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface StartTestConfig {
  questionCount: number;
  duration: number;
}

interface IProps {
  loading: boolean;
}

export default function QuizSummary({ loading }: IProps) {
  const { id: projectId }: any = useParams();
  const router = useRouter();

  const { data: quiz, refetch } = useQuery({
    queryKey: ['quiz', projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/quiz?projectId=${projectId}`);
	  console.log(res.data);
      return res.data.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [projectId]);

  const handleStartTest = async (config: StartTestConfig) => {
    try {
      const response = await axios.post(`/api/quiz/start-test`, {
        projectId: Number(projectId),
        questionCount: config.questionCount,
        duration: config.duration,
      });

      if (response.status === 200) {
        router.push(
          `/projects/${projectId}/quiz-attempt/${response.data.quiz.id}`,
        );
      }
    } catch (error: any) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test. Please try again.');
    }
  };

  if (loading) {
    return (
      <GeneratingDisplay text="Quiz is being initialized, please give us a moment. Good things are coming..." />
    );
  }

  return (
    <SectionContainer>
      {/* Gradient Section */}
      <GradientDiv
        from="blue-200"
        to="emerald-400"
        via="emerald-300"
        className="p-4"
      >
        <div className="flex flex-col gap-4">
          <h5 className="text-2xl font-bold">
            Start a test today to see how much you have learned 📚{' '}
          </h5>
          <StartTestDialog
            trigger={
              <Button className="w-fit p-4 font-medium text-lg">
                Start Test
              </Button>
            }
            maxQuestions={quiz?.questions?.length || 30}
            onStartTest={handleStartTest}
          />
        </div>
      </GradientDiv>

      {/* Overview Section */}
      <div className="mt-4">
        <div className="flex flex-col gap-4">
          <h5 className="text-lg font-medium">Overview</h5>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-[1] flex-col gap-4 border border-gray-200 rounded-lg p-4">
            <h6 className="text-sm font-medium">Quizzes Taken</h6>
            <h1 className="text-6xl font-medium">10</h1>
          </div>

          <div className="flex-[1] flex-col gap-4 border border-gray-200 rounded-lg p-4">
            <h6 className="text-sm font-medium">Average Score</h6>
            <h1 className="text-6xl font-medium">80</h1>
          </div>
        </div>

        <div className="mt-4">
          <LineChart />
        </div>
      </div>

      <div className="mt-4">
        <QuizzesTable />
      </div>
    </SectionContainer>
  );
}
