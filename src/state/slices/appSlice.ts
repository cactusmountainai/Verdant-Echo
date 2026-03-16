import { combineReducers } from '@reduxjs/toolkit';
import timeReducer from './timeSlice';
import moneyReducer from './moneySlice';
import energyReducer from './energySlice';

const appSlice = combineReducers({
  time: timeReducer,
  money: moneyReducer,
  energy: energyReducer,
});

export default appSlice;
