import { useState, useEffect, useRef } from 'react';

interface UseTimelinePlaybackReturn {
  isPlaying: boolean;
  currentDay: number;
  togglePlayback: () => void;
  setCurrentDay: React.Dispatch<React.SetStateAction<number>>;
}

export const useTimelinePlayback = (totalDays: number): UseTimelinePlaybackReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentDay(prev => {
          const next = prev + 0.5;
          if (next >= totalDays) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, totalDays]);

  const togglePlayback = () => {
    if (currentDay >= totalDays) {
      setCurrentDay(0);
    }
    setIsPlaying(!isPlaying);
  };

  return { isPlaying, currentDay, togglePlayback, setCurrentDay };
};