
import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'notification' | 'hover' | 'transition' | 'complete';

const soundFiles = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-light-button-2580.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-musical-reveal-960.mp3',
  error: 'https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3',
  notification: 'https://assets.mixkit.co/sfx/preview/mixkit-doorbell-single-press-333.mp3',
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-soft-bell-interface-button-2574.mp3',
  transition: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-transition-sweep-495.mp3',
  complete: 'https://assets.mixkit.co/sfx/preview/mixkit-soft-win-video-game-notification-269.mp3'
};

export const useSound = () => {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    success: null,
    error: null,
    notification: null,
    hover: null,
    transition: null,
    complete: null
  });

  const soundEnabled = useRef<boolean>(
    localStorage.getItem('soundEnabled') === 'false' ? false : false // Default to false now
  );

  useEffect(() => {
    // Preload audio files
    Object.entries(soundFiles).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.2; // Lower volume for peaceful experience
      audioRefs.current[key as SoundType] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled.current) return;
    
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Error playing sound:', e));
    }
  }, []);

  const toggleSound = useCallback(() => {
    soundEnabled.current = !soundEnabled.current;
    localStorage.setItem('soundEnabled', String(soundEnabled.current));
    return soundEnabled.current;
  }, []);

  const isSoundEnabled = useCallback(() => {
    return soundEnabled.current;
  }, []);

  return { playSound, toggleSound, isSoundEnabled };
};
