import { combineReducers } from '@reduxjs/toolkit';
import cropReducer from './slices/cropSlice';
import timeSystemReducer from './slices/timeSystemSlice';
import projectTimelineReducer from './slices/projectTimelineSlice';
import farmSceneReducer from './slices/farmSceneSlice';

export default combineReducers({
  app: (state) => state, // This is a placeholder - we're using the main store for now
  crop: cropReducer,
  timeSystem: timeSystemReducer,
  projectTimeline: projectTimelineReducer,
  farmScene: farmSceneReducer,
});
