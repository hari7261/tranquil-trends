
import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'notification' | 'hover' | 'transition' | 'complete';

const soundFiles = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2940/2940-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/1380/1380-preview.mp3',
  transition: 'https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'
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
    localStorage.getItem('soundEnabled') === 'false' ? false : true
  );

  useEffect(() => {
    // Preload audio files
    Object.entries(soundFiles).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.3;
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
