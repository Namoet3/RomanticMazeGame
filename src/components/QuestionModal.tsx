
import React from 'react';
import { Question } from '../../types';
import { SOUND_UI_CLICK } from '../../constants';

interface QuestionModalProps {
  activeQuestion: Question;
  onAnswerSubmit: (isCorrect: boolean) => void;
  playSound: (soundSrc: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ activeQuestion, onAnswerSubmit, playSound }) => {
  const handleAnswerClick = (isCorrect: boolean) => {
    playSound(SOUND_UI_CLICK);
    onAnswerSubmit(isCorrect);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-[150] p-2">
      <div className="bg-slate-800 p-4 rounded-md shadow-lg max-w-sm w-full border border-purple-600">
        <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 text-center">{activeQuestion.text}</h3>
        <div className="space-y-2">
          {activeQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index === activeQuestion.correctAnswerIndex)}
              className="w-full block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-3 rounded-sm transition-colors text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
