import React from 'react';

interface IProps {
  quizRefs: any;
  quiz: any;
  userAnswer: any;
}

export default function QuestionsMap({ quizRefs, quiz, userAnswer }: IProps) {
  return (
    <div className="flex-shrink-0">
      <div className="sticky top-4 border border-gray-200 rounded-lg p-4 h-fit">
        <h4 className="text-lg font-medium mb-2">Questions</h4>
        <div className="grid grid-cols-3 gap-1">
          {quiz?.questions?.map((question: any, index: number) => (
            <div
              key={question.id}
              className={`rounded-md p-2 text-center text-sm font-medium cursor-pointer transition-colors ${
                userAnswer[question.id]?.isAnswered
                  ? userAnswer[question.id]?.isCorrect
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => {
                quizRefs.current[question.id]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
