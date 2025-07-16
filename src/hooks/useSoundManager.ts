
import { useState, useCallback, useEffect, useRef } from 'react';
import { SFX_VOLUME_DEFAULT, MUSIC_VOLUME_DEFAULT } from '../../constants';

interface ActiveSound {
  audio: HTMLAudioElement;
  src: string;
  isMusic: boolean;
}

export const useSoundManager = () => {
  const [isAudioContextAllowed, setIsAudioContextAllowed] = useState(false);
  const activeSoundsRef = useRef<Map<string, ActiveSound>>(new Map()); // Keyed by src for music, unique key for SFX instances
  const sfxInstanceCounterRef = useRef(0);

  // Attempt to enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setIsAudioContextAllowed(true);
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };

    if (!isAudioContextAllowed) {
      window.addEventListener('click', enableAudio, { once: true });
      window.addEventListener('keydown', enableAudio, { once: true });
    }

    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
      // Cleanup: Stop all sounds when the hook unmounts (e.g., component unmounts)
      activeSoundsRef.current.forEach(sound => {
        sound.audio.pause();
        sound.audio.src = ''; // Release resources
      });
      activeSoundsRef.current.clear();
    };
  }, [isAudioContextAllowed]);

  const playSound = useCallback((src: string, loop: boolean = false, isMusic: boolean = false) => {
    if (!isAudioContextAllowed && !isMusic) { // Allow music to be prepared even if context not fully active
        // console.warn('Audio context not yet active. Sound not played:', src);
        // return;
    }
    
    try {
      if (isMusic) {
        // Stop other music tracks before starting a new one
        activeSoundsRef.current.forEach((sound, key) => {
          if (sound.isMusic && sound.src !== src) {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            activeSoundsRef.current.delete(key);
          }
        });

        if (activeSoundsRef.current.has(src)) {
          const existing = activeSoundsRef.current.get(src)!;
          if (existing.audio.paused) { 
             existing.audio.play().catch(e => console.error(`Error playing existing music ${src}:`, e));
          }
          return;
        }
      }

      const audio = new Audio(src);
      audio.loop = loop;
      audio.volume = isMusic ? MUSIC_VOLUME_DEFAULT : SFX_VOLUME_DEFAULT;

      const soundKey = isMusic ? src : `${src}-${sfxInstanceCounterRef.current++}`;

      audio.play().then(() => {
        activeSoundsRef.current.set(soundKey, { audio, src, isMusic });
      }).catch(error => {
        if (error.name === 'NotAllowedError') {
          // console.warn(`Autoplay for ${src} was prevented. User interaction needed.`);
           setIsAudioContextAllowed(false); // Re-flag to try enabling context again
        } else {
          console.error(`Error playing sound ${src}:`, error);
        }
      });

      if (!isMusic) { // SFX are short, clean up after they likely finished
        audio.onended = () => {
          activeSoundsRef.current.delete(soundKey);
          audio.src = ''; // Release resources
        };
         audio.onerror = () => { // Also cleanup on error
          activeSoundsRef.current.delete(soundKey);
          audio.src = ''; 
        };
      }
    } catch (e) {
      console.error(`Failed to play sound ${src}:`, e);
    }
  }, [isAudioContextAllowed]);

  const stopSound = useCallback((src: string) => {
    activeSoundsRef.current.forEach((sound, key) => {
      if (sound.src === src) {
        sound.audio.pause();
        sound.audio.currentTime = 0;
        if(sound.isMusic) { // Only delete music tracks, SFX might have multiple instances or auto-cleanup
            activeSoundsRef.current.delete(key);
        }
      }
    });
  }, []);

  const stopAllSounds = useCallback(() => {
    activeSoundsRef.current.forEach(sound => {
      sound.audio.pause();
      sound.audio.currentTime = 0;
    });
    activeSoundsRef.current.clear();
  }, []);

  const preloadSounds = useCallback((sources: string[]) => {
    sources.forEach(src => {
      const audio = new Audio();
      audio.src = src;
      // Note: Actual loading is deferred by the browser until needed or play() is called.
      // This just hints the browser. Some browsers might pre-buffer.
    });
  }, []);

  return { playSound, stopSound, stopAllSounds, preloadSounds, isAudioContextAllowed };
};
