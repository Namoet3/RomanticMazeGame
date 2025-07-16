
import React from 'react';
import { PlayerState } from '../../types'; 
import { HeartIcon, ShieldIcon, KeyIcon, DreamEssenceIcon, PauseIcon } from '../../components/icons'; 
import { TOTAL_LEVELS } from '../../constants';

interface HeartLossAnimDataType {
  index: number;
  triggerKey: number;
}

interface HUDProps {
  playerState: PlayerState;
  currentLevel: number;
  isLastStandAnimating: boolean; 
  heartLossAnimData: HeartLossAnimDataType | null; 
  onPauseGame: () => void;
  elapsedTimeForHUD: number; // Added prop for HUD timer
}

const formatElapsedTimeForHUD = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) { // Check for NaN and negative
    totalSeconds = 0;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  const mDisplay = String(minutes).padStart(2, '0');
  const sDisplay = String(seconds).padStart(2, '0');
  
  return `${mDisplay}:${sDisplay}`;
};


const HUD: React.FC<HUDProps> = ({ playerState, currentLevel, isLastStandAnimating, heartLossAnimData, onPauseGame, elapsedTimeForHUD }) => {
  const formattedTimeHUD = formatElapsedTimeForHUD(elapsedTimeForHUD);

  return (
    <div className="mt-2 p-2 sm:p-2.5 bg-purple-800 bg-opacity-70 rounded-md shadow-lg w-full max-w-lg lg:max-w-xl xl:max-w-2xl flex justify-between items-center text-xs">
      {/* Left Section: Hearts */}
      <div className="flex items-center">
        <span className="mr-1 font-semibold text-pink-300">Aşk:</span>
        {Array.from({ length: playerState.maxHearts }).map((_, i) => {
          let heartClasses = `w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 `;
          if (i < playerState.hearts) {
            heartClasses += 'text-red-400';
            if (playerState.hearts === 1 && !isLastStandAnimating) {
              heartClasses += ' animate-heartbeat-pulse';
            }
          } else {
            heartClasses += 'text-purple-600';
          }

          if (heartLossAnimData && heartLossAnimData.index === i) {
            heartClasses += ' animate-heart-lost';
          }
          
          return (
            <HeartIcon 
              key={`heart-${i}-${heartLossAnimData?.triggerKey ?? ''}`} 
              className={heartClasses} 
            />
          );
        })}
      </div>

      {/* Center Section: Timer, Level, Couple Power */}
      <div className="flex flex-col items-center">
        <span className="font-semibold text-yellow-200" title="Geçen Süre">{formattedTimeHUD}</span>
        <span className="font-semibold text-green-300">Rüya: {currentLevel}/{TOTAL_LEVELS}</span>
        {playerState.isCouplePowerActive && <span className="text-xs text-yellow-300 animate-pulse">Çift Gücü! ({Math.ceil(playerState.couplePowerDuration / 1000)}s)</span>}
      </div>
      
      {/* Right Section: Items, Aura, Pause */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {playerState.hasPortalKey && <KeyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" title="Portal Anahtarı Alındı!" />}
        {playerState.hasShield && <ShieldIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300 animate-pulse" title="Aşk Kalkanı Aktif!" />}
        {playerState.dreamEssenceCollected > 0 && (
          <div className="flex items-center" title="Rüya Özü">
            <DreamEssenceIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
            <span className="ml-0.5 text-purple-300 text-xs">{playerState.dreamEssenceCollected}</span>
          </div>
        )}
        <span className="font-semibold text-yellow-300 text-xs sm:text-sm">Aura: {playerState.flashlightRadius.toFixed(1)}</span>
        <button 
          onClick={onPauseGame} 
          className="p-0.5 sm:p-1 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
          aria-label="Oyunu Duraklat"
          title="Oyunu Duraklat (Esc)"
        >
          <PauseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default HUD;
