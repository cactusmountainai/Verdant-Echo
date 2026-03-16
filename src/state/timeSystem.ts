import { store } from './store';
import { update_time } from './slices/timeSlice';

export function tick() {
  const state = store.getState();
  let { hours, minutes } = state.time.currentTime;

  minutes += 15;
  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
    if (hours >= 24) {
      hours = 0;
    }
  }

  store.dispatch(update_time({ hours, minutes }));
}
