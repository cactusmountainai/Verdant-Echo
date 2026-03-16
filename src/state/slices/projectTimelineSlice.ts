import { createSlice } from '@reduxjs/toolkit';
import { ProjectTimelineState } from '../../models/project_timeline';

const initialState: ProjectTimelineState = {
  milestones: [],
  currentPhase: 'planning',
  progress: 0,
};

export const projectTimelineSlice = createSlice({
  name: 'projectTimeline',
  initialState,
  reducers: {
    addMilestone: (state, action) => {
      state.milestones.push(action.payload);
    },
    updateMilestoneStatus: (state, action) => {
      const milestone = state.milestones.find(m => m.id === action.payload.id);
      if (milestone) {
        milestone.status = action.payload.status;
      }
    },
    setPhase: (state, action) => {
      state.currentPhase = action.payload;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const { addMilestone, updateMilestoneStatus, setPhase, updateProgress } = projectTimelineSlice.actions;
export default projectTimelineSlice.reducer;
