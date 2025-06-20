import React, { useEffect, useMemo, useState } from 'react';
import { DrizzleQuiz } from '@/lib/db/drizzleType';
import OptionButton from './OptionButton';
import { Button } from '../ui/button';
import { ArrowDownIcon } from 'lucide-react';

interface QuizProps extends DrizzleQuiz {
  index: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

interface IProps {
  question: QuizProps;
  handleUserAnswer: (questionId: number, answer: string) => void;
  userAnswer: any;
  handleNextQuestion: () => void;
}


export default function Quiz({
  question,
  handleUserAnswer,
  userAnswer,
  handleNextQuestion,
}: IProps) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer.answer);
      setIsAnswered(true);
      setShowExplanation(true);
    }
  }, [userAnswer]);

  const handleOptionClick = (selectedOption: string) => {
    if (isAnswered) return; // Prevent multiple answers
    
    setAnswer(selectedOption);
    setIsAnswered(true);
    setShowExplanation(true);
    handleUserAnswer(question.id, selectedOption);
  };

  const isCorrect = useMemo(() => {
    return answer === question.correctAnswer;
  }, [answer, question.correctAnswer]);

  if (!question) return null;
  
  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
      <h4 className="text-lg font-medium">
        {question?.index}. {question.question}
      </h4>
      
      <div className="flex flex-col justify-start gap-2">
        <OptionButton
          option={question.optionA}
          onClick={() => handleOptionClick(question.optionA)}
          isCorrectAnswer={question.correctAnswer === question.optionA}
          isSelectedAnswer={answer === question.optionA}
          isAnswered={isAnswered}
          isDisabled={isAnswered}
        />
        <OptionButton
          option={question.optionB}
          onClick={() => handleOptionClick(question.optionB)}
          isCorrectAnswer={question.correctAnswer === question.optionB}
          isSelectedAnswer={answer === question.optionB}
          isAnswered={isAnswered}
          isDisabled={isAnswered}
        />
        <OptionButton
          option={question.optionC}
          onClick={() => handleOptionClick(question.optionC)}
          isCorrectAnswer={question.correctAnswer === question.optionC}
          isSelectedAnswer={answer === question.optionC}
          isAnswered={isAnswered}
          isDisabled={isAnswered}
        />
        <OptionButton
          option={question.optionD}
          onClick={() => handleOptionClick(question.optionD)}
          isCorrectAnswer={question.correctAnswer === question.optionD}
          isSelectedAnswer={answer === question.optionD}
          isAnswered={isAnswered}
          isDisabled={isAnswered}
        />
      </div>

      {/* Immediate Feedback */}
      {isAnswered && (
        <div className={`mt-2 p-3 rounded-md border-l-4 ${
          isCorrect 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-red-600">✗</span>
            )}
            <span className="font-medium">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="text-sm">
            {isCorrect 
              ? 'Great job! You got this one right.' 
              : `The correct answer is: ${question.correctAnswer}`
            }
          </p>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h5 className="font-medium text-blue-800 mb-1">Explanation:</h5>
          <p className="text-sm text-blue-700">{question.explanation}</p>
        </div>
      )}

      {
        isAnswered ? (
          <div className="flex justify-end">
            <Button className="w-fit flex items-center justify-center" onClick={handleNextQuestion}>
              Next <ArrowDownIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : null
      }
    </div>
  );
}
