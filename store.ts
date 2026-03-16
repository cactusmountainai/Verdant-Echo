import { create } from 'zustand';

interface GameState {
  currentScene: string;
  isGameLoaded: boolean;
}

export const useStore = create<GameState>((set) => ({
  currentScene: '',
  isGameLoaded: false,
}));
