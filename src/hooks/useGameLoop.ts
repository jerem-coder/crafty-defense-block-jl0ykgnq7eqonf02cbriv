import { useEffect, useRef, useCallback } from 'react';
import { useGameStore, useGameActions } from '@/store/game-store';
export const useGameLoop = () => {
  const { update } = useGameActions();
  const gameStatus = useGameStore(state => state.gameStatus);
  const lastTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number>(0);
  const loop = useCallback(
    (currentTime: number) => {
      if (lastTimeRef.current !== 0) {
        const deltaTime = (currentTime - lastTimeRef.current) / 1000; // in seconds
        if (gameStatus === 'PLAYING') {
          update(deltaTime);
        }
      }
      lastTimeRef.current = currentTime;
      animationFrameId.current = requestAnimationFrame(loop);
    },
    [update, gameStatus],
  );
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [loop]);
};