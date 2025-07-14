import React, { useState } from 'react';
import SectionContainer from '../SectionContainer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import LoadingComponent from '../LoadingComponent';
import EmptyDisplay from '../EmptyDisplay';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';

export default function Summary() {
  const { id: projectId } = useParams();

  const queryClient = useQueryClient();

  const [liveText, setLiveText] = useState(null);

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const res = await axios.get(`/api/summary?projectId=${projectId}`);

      if (res.status === 401) {
        toast.error('You are not authorized to view this summary');
      }

      if (res.status === 404) {
        // toast.error('Summary not found');/
        return null;
      }

      return res.data.data;
    },
  });

  const { mutateAsync: generateSummary, isPending: isGenerating } = useMutation(
    {
      mutationFn: async () => {
        const res = await fetch('/api/summary', {
          method: 'POST',
          body: JSON.stringify({
            projectId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.body) {
          throw new Error('Failed to generate summary');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setLiveText((prev) => prev + text);
        }

        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['summary'] });
        toast.success('Summary generated successfully');
      },
      onError: () => {
        toast.error('Something went wrong in generating summary');
      },
    },
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!summary) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <EmptyDisplay
          src={'/images/no-projects.png'}
          text="You haven't had your own summary yet. Let's generate some!"
        />
        <Button
          onClick={() => generateSummary()}
          disabled={isGenerating}
          className="w-fit"
        >
          {isGenerating ? 'Generating...' : 'Generate Summary'}
        </Button>
      </div>
    );
  }

  console.log(summary, 'summary');

  return (
    <SectionContainer>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{summary.title}</h1>

        <div className="flex flex-col gap-2 mt-4">
          <ReactMarkdown>{liveText || summary.text}</ReactMarkdown>
        </div>
      </div>
    </SectionContainer>
  );
}
