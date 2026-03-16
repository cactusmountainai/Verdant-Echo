class TimeSystem {
  constructor() {
    this.hours = 6;   // Start at 6 AM
    this.minutes = 0;
    this.day = 1;
  }

  tick() {
    this.minutes += 10;
    
    // Handle minute-to-hour rollover
    if (this.minutes >= 60) {
      this.hours += Math.floor(this.minutes / 60);
      this.minutes %= 60;
    }
    
    // Handle hour-to-day rollover
    if (this.hours >= 24) {
      this.day += Math.floor(this.hours / 24);
      this.hours %= 24;
    }
  }

  getTime() {
    return { hours: this.hours, minutes: this.minutes, day: this.day };
  }
}

export default TimeSystem;
