class TimeSystem {
  private hours: number;
  private minutes: number;
  private day: number;

  constructor() {
    this.hours = 6;   // Start at 6 AM
    this.minutes = 0;
    this.day = 1;
  }

  tick(): void {
    this.minutes += 10;

    // Handle minute-to-hour rollover
    if (this.minutes >= 60) {
      const hoursToAdd = Math.floor(this.minutes / 60);
      this.hours += hoursToAdd;
      this.minutes %= 60;
    }

    // Handle hour-to-day rollover
    if (this.hours >= 24) {
      const daysToAdd = Math.floor(this.hours / 24);
      this.day += daysToAdd;
      this.hours %= 24;
    }
  }

  getTime(): { hours: number; minutes: number; day: number } {
    return { hours: this.hours, minutes: this.minutes, day: this.day };
  }
}

export default TimeSystem;
