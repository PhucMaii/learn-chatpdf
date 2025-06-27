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
import { 
	Trophy, 
	Target, 
	TrendingUp, 
	Clock, 
	BarChart3,
	Award
} from 'lucide-react';

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

  const { data: quiz, refetch, isLoading } = useQuery({
    queryKey: ['quiz', projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/quiz?projectId=${projectId}`);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [projectId, refetch]);

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

  if (loading || isLoading) {
    return (
      <GeneratingDisplay text="Quiz is being initialized, please give us a moment. Good things are coming..." />
    );
  }

  // Prepare chart data
  const chartData = quiz?.quizAttempts?.map((attempt: any) => attempt.score) || [];
  const chartLabels = quiz?.quizAttempts?.map((attempt: any) =>
    new Date(attempt.startedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  ) || [];

  // Calculate additional statistics
  const totalAttempts = quiz?.quizAttempts?.length || 0;
  const averageScore = quiz?.avgScore || 0;
  const bestScore = Math.max(...(quiz?.quizAttempts?.map((a: any) => a.score) || [0]));
  const totalTimeSpent = quiz?.quizAttempts?.reduce((sum: number, a: any) => sum + (a.totalTime || 0), 0) || 0;
  const averageTimePerAttempt = totalAttempts > 0 ? totalTimeSpent / totalAttempts : 0;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <SectionContainer>
      {/* Hero Section */}
      <GradientDiv
        from="blue-200"
        to="emerald-400"
        via="emerald-300"
        className="p-6 rounded-xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-full">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h5 className="text-2xl font-bold">
                Ready to test your knowledge? 📚
              </h5>
              <p className="text-sm">
                Challenge yourself with our comprehensive quiz system
              </p>
            </div>
          </div>
          <StartTestDialog
            trigger={
              <Button className="w-fit p-4 font-medium text-lg">
                Start New Test
              </Button>
            }
            maxQuestions={quiz?.questions?.length || 30}
            onStartTest={handleStartTest}
          />
        </div>
      </GradientDiv>

      {/* Statistics Overview */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h5 className="text-xl font-semibold text-gray-900">Performance Overview</h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">Total Attempts</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{totalAttempts}</div>
            <div className="text-sm text-blue-600">Quiz attempts</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700">Average Score</span>
            </div>
            <div className="text-3xl font-bold text-green-900">{averageScore.toFixed(1)}%</div>
            <div className="text-sm text-green-600">Overall performance</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">Best Score</span>
            </div>
            <div className="text-3xl font-bold text-purple-900">{bestScore}%</div>
            <div className="text-sm text-purple-600">Personal best</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-amber-700">Avg Time</span>
            </div>
            <div className="text-3xl font-bold text-amber-900">{formatTime(averageTimePerAttempt)}</div>
            <div className="text-sm text-amber-600">Per attempt</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h6 className="text-lg font-semibold text-gray-900">Performance Trend</h6>
          </div>
          
          {chartData.length > 0 ? (
            <LineChart
              seriesData={chartData}
              horizontalAxis={chartLabels}
            />
          ) : (
            <div className="flex items-center justify-center h-[350px] border border-gray-200 rounded-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No quiz attempts yet</p>
                <p className="text-sm text-gray-400">Start your first test to see your performance chart!</p>
              </div>
            </div>
          )}
        </div>

        {/* Quiz History Table */}
        <div className="mb-8">
          <QuizzesTable quizAttempts={quiz?.quizAttempts || []} />
        </div>
      </div>
    </SectionContainer>
  );
}
