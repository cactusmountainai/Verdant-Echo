import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectTimelineState } from '../../models/project_timeline';

const initialState: ProjectTimelineState = {
  milestones: [],
  tasks: [],
  currentPhase: 'planning',
  progress: 0,
};

export const projectTimelineSlice = createSlice({
  name: 'projectTimeline',
  initialState,
  reducers: {
    addMilestone: (state, action: PayloadAction<any>) => {
      state.milestones.push(action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    setPhase: (state, action: PayloadAction<string>) => {
      state.currentPhase = action.payload;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.progress = Math.max(0, Math.min(100, action.payload));
    },
  },
});

export const { addMilestone, updateTaskStatus, setPhase, updateProgress } = projectTimelineSlice.actions;
export default projectTimelineSlice.reducer;
