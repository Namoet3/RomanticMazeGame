
import React from 'react';
import { CUTE_GAME_OVER_MESSAGES } from '../../constants';

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  const randomMessage = CUTE_GAME_OVER_MESSAGES[Math.floor(Math.random() * CUTE_GAME_OVER_MESSAGES.length)];

  return (
    <div className="text-center p-4 sm:p-6 bg-purple-800 bg-opacity-80 rounded-lg shadow-xl max-w-md mx-auto screen-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4">{randomMessage.split('.')[0]}...</h2>
      <p className="text-sm sm:text-base text-indigo-200 mb-6">{randomMessage.substring(randomMessage.indexOf('.') + 1).trim() || "But our love story is eternal. Let's dream again, my brave heart!"}</p>
      <button
        onClick={onRestart}
        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md text-base sm:text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      >
        Tekrar Rüya Gör? (Enter)
      </button>
    </div>
  );
};

export default GameOverScreen;