
import React from 'react';
import { PowerUpType } from '../../types';
import { POWERUP_ICON_DETAILS, SOUND_UI_CLICK } from '../../constants';
import * as Icons from '../../components/icons'; 

interface PlayerChoiceModalProps {
  prompt: string;
  options: [PowerUpType, PowerUpType];
  onChoice: (chosenPowerUp: PowerUpType) => void;
  playSound: (soundSrc: string) => void;
}

const PlayerChoiceModal: React.FC<PlayerChoiceModalProps> = ({ prompt, options, onChoice, playSound }) => {
  if (!options || options.length !== 2) return null;

  const handleChoiceClick = (powerUp: PowerUpType) => {
    playSound(SOUND_UI_CLICK);
    onChoice(powerUp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[160] p-2 screen-fade-in">
      <div className="bg-slate-800 p-4 sm:p-5 rounded-lg shadow-xl max-w-md w-full border border-purple-500">
        <h3 className="text-base sm:text-lg font-semibold text-yellow-300 mb-3 text-center">{prompt}</h3>
        <div className="space-y-2.5 sm:space-y-3">
          {options.map((powerUpType) => {
            const detail = POWERUP_ICON_DETAILS[powerUpType];
            const IconC = (Icons as any)[detail.IconComponent] || Icons.HeartIcon; 

            return (
              <button
                key={powerUpType}
                onClick={() => handleChoiceClick(powerUpType)}
                className="w-full flex items-center justify-start space-x-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 px-3.5 rounded-md transition-colors text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-opacity-50"
              >
                <IconC className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
                <span className="flex-grow text-left">{detail.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerChoiceModal;
