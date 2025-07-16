
import React from 'react';
import { PlayerState } from '../../types';
import { TOTAL_LOVE_LETTER_FRAGMENTS, FULL_LOVE_LETTER } from '../../constants';

interface CreditsScreenProps {
  playerState: PlayerState;
  onRestart: () => void;
  totalElapsedTime: number; // Added prop
}

const formatElapsedTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds <= 0) { // Check for NaN and non-positive
    return "0 saniye";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  let result = "";
  if (minutes > 0) {
    result += `${minutes} dakika`;
  }
  if (seconds > 0) {
    if (minutes > 0) result += " ";
    result += `${seconds} saniye`;
  }
  return result.trim() || "0 saniye"; // Fallback for case where totalSeconds was very small positive
};

const CreditsScreen: React.FC<CreditsScreenProps> = ({ playerState, onRestart, totalElapsedTime }) => {
  const collectedAllFragments = playerState.loveLetterFragmentsCollected.size === TOTAL_LOVE_LETTER_FRAGMENTS;
  
  let loveLetterDisplay: React.ReactNode;
  if (collectedAllFragments) {
    loveLetterDisplay = Array.from(playerState.loveLetterFragmentsCollected)
        .sort()
        .map(id => FULL_LOVE_LETTER[id] || "")
        .map((fragment, index) => <p key={`frag-${index}`} className="font-handwritten text-lg sm:text-xl text-pink-200 leading-snug">{fragment}</p>);
  } else {
    loveLetterDisplay = <p className="text-indigo-200">{TOTAL_LOVE_LETTER_FRAGMENTS} aşk mektubu parçasından {playerState.loveLetterFragmentsCollected.size} tanesini buldun! Hepsini bulup tamamlanmış aşk notumuzu ortaya çıkarmak için tekrar oyna!</p>;
  }

  const formattedTime = formatElapsedTime(totalElapsedTime);

  return (
        <div className="text-center p-4 sm:p-6 bg-purple-800 bg-opacity-80 rounded-lg shadow-xl max-w-lg mx-auto screen-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-4">[Victory Title Placeholder]</h2>
        {collectedAllFragments && (
          <h3 className="text-xl text-yellow-300 mb-3 font-handwritten">[Secret Message Header Placeholder]</h3>
        )}
        <div className="text-left text-xs sm:text-sm space-y-3 mb-6 leading-relaxed px-1 sm:px-2 max-h-[40vh] overflow-y-auto">
          <div className="space-y-1 mb-3">{loveLetterDisplay}</div>
          <hr className="my-3 border-purple-600" />
          <p className="font-handwritten text-lg sm:text-xl text-pink-200">[Greeting Placeholder]</p>
          <p className="text-indigo-200">[Paragraph 1 Placeholder]</p>
          <p className="text-indigo-200">[Paragraph 2 Placeholder]</p>
          <p className="text-indigo-200">[Paragraph 3 Placeholder]</p>
          <p className="text-indigo-200 mt-2">
            [Completion Time Placeholder: <strong className="text-pink-300">{formattedTime}</strong>]
          </p>
          <p className="font-handwritten text-lg sm:text-xl text-pink-200">[Closing Line Placeholder]</p>
          <p className="font-handwritten text-lg sm:text-xl text-pink-200">[Signature Placeholder]</p>
        </div>
        <button
          onClick={onRestart}
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md text-base sm:text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          [Restart Button Text Placeholder]
        </button>
      </div>

  );
};

export default CreditsScreen;
