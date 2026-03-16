import { create } from 'zustand';

/**
 * State interface for the application store
 */
interface AppState {
  time: number;
  farmState: string;
  set_time: (time: number) => void;
  set_farm_state: (state: string) => void;
}

/**
 * Application state store using Zustand
 */
export const useStore = create<AppState>((set) => ({
  time: 0,
  farmState: 'idle',
  set_time: (time) => set({ time }),
  set_farm_state: (state) => set({ farmState: state }),
}));
