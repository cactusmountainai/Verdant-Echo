import { create } from 'zustand'

interface GameState {
  time: number
  setTime: (time: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  time: 0,
  setTime: (time) => set({ time }),
}))
