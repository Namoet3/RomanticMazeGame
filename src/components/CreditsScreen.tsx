
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
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-4">Rüyayı Aştın, Aşkım!</h2>
      {collectedAllFragments && <h3 className="text-xl text-yellow-300 mb-3 font-handwritten">Gizli Sözümüz Ortaya Çıktı:</h3>}
      <div className="text-left text-xs sm:text-sm space-y-3 mb-6 leading-relaxed px-1 sm:px-2 max-h-[40vh] overflow-y-auto">
        <div className="space-y-1 mb-3">{loveLetterDisplay}</div>
        <hr className="my-3 border-purple-600" />
        <p className="font-handwritten text-lg sm:text-xl text-pink-200">Biricik Premsesim,</p>
        <p className="text-indigo-200">Büyülü labirentimde dans ettin, aşkımız senin her yolunu aydınlattı. Başarıyla bu mini labirentimden geçtin. Başından beri reflekslerine güveniyordum.</p>
        <p className="text-indigo-200">Bu küçük oyun, şirin hayaletleriyle ve yumuşak parıltılarıyla, paylaştığımız sihirli, büyük romantizmin minik bir yansıması. Sana olan aşkım, labirentte yolunu aydınlatan aura gibi hiç sönmeyen ve git gide artan sonsuz bir güce sahip. </p>
        <p className="text-indigo-200">Senin gelmeni dört gözle beklerken senin için yaptığım bu tatlı, içten macerayı paylaştığın için teşekkür ederim.</p>
        <p className="text-indigo-200 mt-2">Bu rüya macerasını <strong className="text-pink-300">{formattedTime}</strong> içinde tamamladın!</p>
        <p className="font-handwritten text-lg sm:text-xl text-pink-200">Tüm aşkımla, her rüyada ve uyanık anda, sonsuza dek ve daima,</p>
        <p className="font-handwritten text-lg sm:text-xl text-pink-200">Pek sevgili Pupsiğin</p>
      </div>
      <button
        onClick={onRestart}
        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md text-base sm:text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
      >
        Rüyamızı Yeniden Yaşa? (Enter)
      </button>
    </div>
  );
};

export default CreditsScreen;
