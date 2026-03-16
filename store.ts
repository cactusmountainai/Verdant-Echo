import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  timeSystem: TimeSystem | null;
  farmScene: FarmScene | null;
  isLoading: boolean;
  error: string | null;
  
  setTimeSystem: (system: TimeSystem) => void;
  setFarmScene: (scene: FarmScene) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Declare types that are used in the store
declare global {
  interface TimeSystem {
    getCurrentTime(): Date;
    setTimeScale(scale: number): void;
    pause(): void;
    resume(): void;
    reset(): void;
  }
  
  interface FarmScene {
    update(deltaTime: number): void;
    render(canvas: HTMLCanvasElement): void;
    addObject(obj: any): void;
    getCameraPosition(): { x: number, y: number };
    setCameraPosition(x: number, y: number): void;
  }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      timeSystem: null,
      farmScene: null,
      isLoading: false,
      error: null,

      setTimeSystem: (system) => set({ timeSystem: system }),
      setFarmScene: (scene) => set({ farmScene: scene }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () => set({
        timeSystem: null,
        farmScene: null,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'farm-storage',
      partialize: (state) => ({ 
        timeSystem: state.timeSystem, 
        farmScene: state.farmScene 
      }) // Only persist essential state
    }
  )
)
