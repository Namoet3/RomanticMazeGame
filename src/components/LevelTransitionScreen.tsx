import React, { useState, useEffect } from 'react';
import { HeartIcon } from '../../components/icons';

interface LevelTransitionScreenProps {
  currentLevel: number;
  levelBriefing?: string;
}

const romanticLoadingMessages = [
  "Rüya kapıları aralanıyor...",
  "Tatlı anılar yükleniyor...",
  "Bir sonraki hayalimize doğru...",
];

const LevelTransitionScreen: React.FC<LevelTransitionScreenProps> = ({ currentLevel, levelBriefing }) => {
  const [currentFullTitle, setCurrentFullTitle] = useState('');
  const [animatedTitle, setAnimatedTitle] = useState('');

  useEffect(() => {
    let baseMessage;
    if (romanticLoadingMessages && romanticLoadingMessages.length > 0) {
        baseMessage = romanticLoadingMessages[Math.floor(Math.random() * romanticLoadingMessages.length)];
    }
    
    // Fallback if baseMessage is still undefined
    if (typeof baseMessage === 'undefined' || baseMessage === null || baseMessage === "") {
        baseMessage = "Rüya kapıları aralanıyor..."; // A safe default
    }

    const titleText = `${baseMessage} (Seviye ${currentLevel})`;
    setCurrentFullTitle(titleText);

    if (titleText.length > 0) {
      setAnimatedTitle(titleText[0]); // Initialize with the first character
      
      if (titleText.length > 1) { // Only set interval if there's more than one char
        let index = 1; // Start animation from the second character
        const intervalId = setInterval(() => {
          setAnimatedTitle(prev => {
            if (index < titleText.length) {
              const nextChar = titleText[index];
              index++;
              return prev + nextChar;
            } else {
              clearInterval(intervalId);
              return prev;
            }
          });
          if (index >= titleText.length) {
            clearInterval(intervalId);
          }
        }, 90); // Animation speed for title
        return () => clearInterval(intervalId); // Cleanup
      } else {
        setAnimatedTitle(titleText); // Title is only one character
      }
    } else {
      setAnimatedTitle(''); // Title is empty
    }
  }, [currentLevel]);


  const briefingAnimationDelay = (currentFullTitle.length * 0.09) + 0.4; // Delay for paragraph based on title animation

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-[100] p-4 sm:p-6 text-center">
      <h2 
        className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 min-h-[2.5em] flex items-center justify-center relative px-2 w-full max-w-xl"
      >
        {/* Invisible sizer text - always present, defines the full width/height */}
        <span className="opacity-0 whitespace-pre">{currentFullTitle || " "}</span>
        {/* Absolutely positioned visible text, animates by changing its content */}
        <span className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center whitespace-pre text-center">
          {animatedTitle}
        </span>
      </h2>

      {levelBriefing && (
        <p
          className="text-sm sm:text-base text-indigo-200 mb-6 animate-fade-in-up max-w-md"
          style={{ animationDelay: `${briefingAnimationDelay}s` }}
          dangerouslySetInnerHTML={{ __html: levelBriefing }}
        />
      )}
      {!levelBriefing && currentFullTitle && ( // Fallback if briefing is not ready
           <p 
             className="text-sm sm:text-base text-indigo-200 mb-6 animate-fade-in-up max-w-md"
             style={{ animationDelay: `${briefingAnimationDelay}s` }}
           >
             Yeni bir rüya hazırlanıyor...
           </p>
      )}

      <div className="flex space-x-1.5 mt-4">
        <HeartIcon className="animate-ping h-6 w-6 text-pink-500 opacity-75" />
        <HeartIcon className="animate-ping h-6 w-6 text-pink-400 opacity-50" style={{ animationDelay: '0.2s' }} />
        <HeartIcon className="animate-ping h-6 w-6 text-pink-300 opacity-75" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default LevelTransitionScreen;