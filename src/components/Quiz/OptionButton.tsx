import React from 'react'

const OptionButton = ({
    option,
    onClick,
    isCorrectAnswer,
    isSelectedAnswer,
    isAnswered,
    isDisabled,
  }: {
    option: string;
    onClick: () => void;
    isCorrectAnswer: boolean;
    isSelectedAnswer: boolean;
    isAnswered: boolean;
    isDisabled: boolean;
  }) => {
    const getButtonClasses = () => {
      let baseClasses = "font-medium rounded-md px-3 py-2 text-left transition-all duration-200 ";
      
      if (isDisabled) {
        baseClasses += "cursor-not-allowed opacity-60 ";
      } else {
        baseClasses += "hover:bg-gray-200 ";
      }
  
      if (isAnswered) {
        if (isCorrectAnswer) {
          baseClasses += "bg-green-100 border-2 border-green-500 text-green-800 ";
        } else if (isSelectedAnswer && !isCorrectAnswer) {
          baseClasses += "bg-red-100 border-2 border-red-500 text-red-800 ";
        } else {
          baseClasses += "bg-gray-50 border border-gray-200 ";
        }
      } else {
        baseClasses += "bg-gray-100 ";
      }
  
      return baseClasses;
    };
  
    return (
      <button
        className={getButtonClasses()}
        onClick={onClick}
        disabled={isDisabled}
      >
        {option}
      </button>
    );
  };
  

export default OptionButton