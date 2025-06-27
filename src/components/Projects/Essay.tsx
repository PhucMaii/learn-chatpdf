import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { DrizzleEssay } from '@/lib/db/drizzleType';
import axios from 'axios';
import { useParams } from 'next/navigation';
import SelectComponent from '../SelectComponent';
import { languages, wordCounts } from '@/lib/constant';
import toast from 'react-hot-toast';
import CircularProgress from '../CircularProgress';
import LoadingComponent from '../LoadingComponent';
import { UserContext } from '../../../context/UserProvider';
import { SUBSCRIPTION_TYPE } from '@/lib/type';
import SectionContainer from '../SectionContainer';
  
export default function Essay() {
  const { id: projectId } = useParams();
  const { user } = useContext(UserContext) as any;

  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHumanized, setIsHumanized] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isGeneratingHumanized, setIsGeneratingHumanized] = useState(false);
  const [essay, setEssay] = useState<DrizzleEssay | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [wordCount, setWordCount] = useState<string>('100');

  const actualWordCount = useMemo(() => {
    if (!essay?.content) return 0;
    return essay.content.split(' ').length;
  }, [essay?.content]);

  useEffect(() => {
    fetchEssay();
  }, [projectId]);

  useEffect(() => {
    if (essay?.content) {
      setIsChecked(false);
    }
  }, [essay?.content]);

  const fetchEssay = async () => {
    try {
      const response = await axios.get(`/api/essay?projectId=${projectId}`);
      setEssay(response.data.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCheckAI = async (content: string = essay?.content || '') => {
    if (
      user?.status !== SUBSCRIPTION_TYPE.PRO &&
      user?.status !== SUBSCRIPTION_TYPE.ELITE
    ) {
      toast.error('You need Pro or Elite to check an essay');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(
        `https://detector.rephrasy.ai/detect_api`,
        {
          text: content,
          model: 'undetectable',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPHRASY_API_KEY}`,
          },
        },
      );

      // Save AI Check Score
      await axios.put(`/api/essay/save-content`, {
        essayId: essay?.id || '-1',
        updatedFields: {
          aiCheckScore: Number(response.data.scores.overall),
          content: content,
        },
      });

      await fetchEssay();
      setIsChecked(true);
      toast.success('Essay checked successfully');
      return response.data.scores.overall;
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to check essay');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateEssay = async () => {
    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }
    try {
      setIsGenerating(true);
      const response = await axios.post(`/api/essay`, {
        projectId: Number(projectId),
        language: language,
        wordCount: Number(wordCount),
      });

      setEssay(response.data.data);
      toast.success('Essay generated successfully');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to generate essay');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHumanizeEssay = async () => {
    if (user?.status !== SUBSCRIPTION_TYPE.ELITE) {
      toast.error('You need Elite to humanize an essay');
      return;
    }

    try {
      setIsGeneratingHumanized(true);
      const response = await axios.post(
        `https://v1-humanizer.rephrasy.ai/api`,
        {
          text: essay?.content,
          model: 'undetectable',
          words: true,
          costs: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REPHRASY_API_KEY}`,
          },
        },
      );

      // Check AI Score Again
      const aiCheckScore = await handleCheckAI(response.data.output);

      // Save humanized content
      await axios.put(`/api/essay/save-content`, {
        essayId: essay?.id,
        updatedFields: {
          content: response.data.output,
          aiCheckScore: Math.ceil(Number(aiCheckScore)),
        },
      });

      await fetchEssay();
      setIsHumanized(true);
      toast.success('Essay humanized successfully');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to humanize essay');
    } finally {
      setIsGeneratingHumanized(false);
    }
  };

  const handleSaveEssay = async () => {
    try {
      setIsSaving(true);
      const response = await axios.put(`/api/essay/save-content`, {
        essayId: essay?.id,
        updatedFields: {
          content: essay?.content,
        },
        projectId: Number(projectId),
      });

      setEssay(response.data.data);
      toast.success('Essay saved successfully');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to save essay');
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <SectionContainer>
      <div className="flex flex-col mb-4">
        <h6 className="text-xl justify-start font-regular">Essay</h6>

        <h1 className="text-2xl justify-start font-regular">{essay?.title}</h1>
      </div>

      <div className="w-full border-1 border-gray-300 rounded-md p-4 flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="w-fit"
            onClick={handleSaveEssay}
            disabled={isSaving}
            name="save-essay"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        {/* textarea height is based on the number of words */}
        <textarea
          placeholder="Write your essay here..."
          value={essay?.content}
          onChange={(e: any) =>
            setEssay((prev: any) => ({ ...prev, content: e.target.value }))
          }
          disabled={isGenerating || isGeneratingHumanized || isInitializing}
          rows={Math.ceil(actualWordCount / 15)}
          className="w-full focus:outline-none font-sans font-regular leading-[1.7]  "
        />
        {essay?.content ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isHumanized && (
                <Button
                  onClick={handleHumanizeEssay}
                  className="w-fit"
                  disabled={
                    user?.status !== SUBSCRIPTION_TYPE.ELITE ||
                    isGeneratingHumanized ||
                    isInitializing ||
                    isGenerating
                  }
                  name="humanize-essay"
                >
                  {isGeneratingHumanized ? 'Humanizing...' : 'Humanize'}
                </Button>
              )}
              {!isChecked && (
                <Button
                  variant="outline"
                  onClick={() => handleCheckAI(essay?.content || '')}
                  className="w-fit"
                  disabled={
                    (user?.status !== SUBSCRIPTION_TYPE.PRO &&
                      user?.status !== SUBSCRIPTION_TYPE.ELITE) ||
                    isGenerating ||
                    isInitializing ||
                    isGeneratingHumanized
                  }
                  name="check-essay"
                >
                  {isGenerating ? 'Checking...' : 'Check'}
                </Button>
              )}
              <h6>{actualWordCount} words</h6>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold">AI Check</h1>
              <CircularProgress percentage={essay?.aiCheckScore || 0} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SelectComponent
              label="Word Count"
              title="Word Count"
              items={wordCounts}
              value={wordCount}
              onChange={(value) => setWordCount(value)}
              className="w-fit"
            />
            <SelectComponent
              label="Language"
              title="Language"
              items={languages}
              value={language}
              onChange={(value) => setLanguage(value)}
              className="w-fit"
            />
            <Button
              onClick={handleGenerateEssay}
              className="w-fit"
              disabled={isGenerating || isInitializing}
              name="generate-essay"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
