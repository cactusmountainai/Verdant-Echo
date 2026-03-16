import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/types';
import { grow, harvest, ship, earn, resetCycle, updateLastUpdated } from '../state/slices/cropSlice';
import { useGameStore } from '../../store';

// Time intervals in milliseconds
const GROW_INTERVAL = 5000; // 5 seconds per growth step
const DAY_LENGTH_MS = 60000; // 1 minute for full day (simplified)

export const useCropCycle = () => {
  const dispatch = useAppDispatch();
  const { time } = useGameStore();
  const cropState = useAppSelector(state => state.crop);

  useEffect(() => {
    // Load saved state from localStorage on component mount
    const savedState = localStorage.getItem('cropState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch(updateLastUpdated(parsed.lastUpdated));
        // We don't restore stage/progress directly — time-based progression will handle it
      } catch (e) {
        console.error('Failed to load crop state', e);
      }
    }

    // Listen for time changes and progress crop cycle
    const lastUpdated = cropState.lastUpdated;
    const now = Date.now();
    const elapsed = now - lastUpdated;

    if (elapsed > 0) {
      // Calculate how much growth should occur based on game time
      const growthIncrement = (elapsed / DAY_LENGTH_MS) * 100; // scale to 100% per day
      
      if (cropState.stage === 'grow' && cropState.progress < 100) {
        dispatch(grow(growthIncrement));
      }

      // Auto-progress through stages based on time and completion
      if (cropState.stage === 'grow' && cropState.progress >= 100) {
        dispatch(harvest());
      }
      
      if (cropState.stage === 'harvest') {
        dispatch(ship());
      }
      
      if (cropState.stage === 'ship') {
        dispatch(earn());
      }

      // If a full day has passed and cycle is complete, reset for next day
      if (cropState.isDayComplete && time > 0 && cropState.lastUpdated < now - DAY_LENGTH_MS) {
        dispatch(resetCycle());
      }
      
      // Update last updated timestamp every tick to preserve state continuity
      dispatch(updateLastUpdated(now));
    }

    // Save state to localStorage whenever it changes
    const saveToStorage = () => {
      localStorage.setItem('cropState', JSON.stringify({
        stage: cropState.stage,
        progress: cropState.progress,
        coins: cropState.coins,
        isDayComplete: cropState.isDayComplete,
        lastUpdated: Date.now(),
      }));
    };

    // Debounce save to avoid excessive writes
    const timeoutId = setTimeout(saveToStorage, 500);
    return () => clearTimeout(timeoutId);

  }, [time, cropState, dispatch]);

  return {
    stage: cropState.stage,
    progress: cropState.progress,
    coins: cropState.coins,
    isDayComplete: cropState.isDayComplete,
  };
};
