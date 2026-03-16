import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ProjectTimelineState {
  milestones: string[];
  completedMilestones: number;
}

const initialState: ProjectTimelineState = {
  milestones: ['Till soil', 'Plant seeds', 'Water crops', 'Wait for growth', 'Harvest', 'Ship produce', 'Earn profit'],
  completedMilestones: 0,
};

export const projectTimelineSlice = createSlice({
  name: 'projectTimeline',
  initialState,
  reducers: {
    completeMilestone: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.milestones.length) {
        state.completedMilestones = Math.max(state.completedMilestones, action.payload + 1);
      }
    },
    
    reset: () => initialState,
  },
});

export const { completeMilestone, reset } = projectTimelineSlice.actions;

export default projectTimelineSlice.reducer;

// Selectors
export const selectProjectMilestones = (state: RootState) => state.projectTimeline.milestones;
export const selectCompletedMilestonesCount = (state: RootState) => state.projectTimeline.completedMilestones;
