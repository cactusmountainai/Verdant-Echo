class TimeSystem {
  constructor() {
    this.currentTime = 6; // Start at 6:00 AM
    this.day = 1;
    this.money = 100; // Example initial money
    this.energy = 100; // Example initial energy
  }

  update(deltaTime) {
    this.currentTime += deltaTime / (60 * 1000); // Convert ms to minutes, then to hours

    // Check for day boundary at 2:00 AM (26:00)
    if (this.currentTime >= 26) {
      this.passOut();
    }
  }

  passOut() {
    // Deduct 10% of money
    this.money *= 0.9;
    
    // Reset energy to full
    this.energy = 100;
    
    // Advance directly to 6:00 AM next day (26 + 4 = 30)
    this.currentTime = 30; // 6 AM next day
    this.day++;
    
    // Optional: trigger UI event or notification
    console.log(`Day ${this.day - 1} passed out at 2:00 AM. Money reduced by 10%. Energy reset. Now ${this.day}:06:00`);
  }

  getTime() {
    return this.currentTime;
  }

  getDay() {
    return this.day;
  }
}

export default TimeSystem;
