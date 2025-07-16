
import React from 'react';
import { SOUND_UI_CLICK } from '../../constants';

interface PauseScreenProps {
  onResumeGame: () => void;
  onReturnToMainMenu: () => void;
  playSound: (soundSrc: string) => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResumeGame, onReturnToMainMenu, playSound }) => {
  const handleResumeClick = () => {
    playSound(SOUND_UI_CLICK);
    onResumeGame();
  };

  const handleMainMenuClick = () => {
    playSound(SOUND_UI_CLICK);
    onReturnToMainMenu();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[200] p-4 screen-fade-in">
      <div className="bg-purple-800 bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-xl max-w-xs w-full border border-pink-500 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-6 sm:mb-8 font-handwritten">
          Oyun Duraklatıldı
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleResumeClick}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-70 transform hover:scale-105"
          >
            Devam Et
          </button>
          <button
            onClick={handleMainMenuClick}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-70 transform hover:scale-105"
          >
            Ana Menü
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
