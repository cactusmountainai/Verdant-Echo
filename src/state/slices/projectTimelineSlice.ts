import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../types';

interface ProjectTimelineState {
  events: Array<{
    id: string;
    title: string;
    date: number;
    description: string;
    status: 'planned' | 'in-progress' | 'completed';
  }>;
  selectedEventId: string | null;
}

const initialState: ProjectTimelineState = {
  events: [],
  selectedEventId: null
};

export const projectTimelineSlice = createSlice({
  name: 'projectTimeline',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Omit<ProjectTimelineState['events'][0], 'id'>>) => {
      state.events.push({
        id: Date.now().toString(),
        ...action.payload
      });
    },
    updateEvent: (state, action: PayloadAction<{id: string; updates: Partial<ProjectTimelineState['events'][0]>}>) => {
      const event = state.events.find(e => e.id === action.payload.id);
      if (event) {
        Object.assign(event, action.payload.updates);
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    selectEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload;
    }
  }
});

export const { addEvent, updateEvent, deleteEvent, selectEvent } = projectTimelineSlice.actions;

// Selectors
export const selectProjectTimeline = (state: RootState) => state.projectTimeline;
export const selectEvents = (state: RootState) => state.projectTimeline.events;
export const selectSelectedEventId = (state: RootState) => state.projectTimeline.selectedEventId;
export const selectEventById = (state: RootState, eventId: string) => 
  state.projectTimeline.events.find(e => e.id === eventId);

export default projectTimelineSlice.reducer;
