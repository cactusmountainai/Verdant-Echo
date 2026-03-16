/**
 * @typedef {Object} TimeConfig
 * @property {number} [speed=1] - Speed multiplier for time progression
 * @property {number} [currentTime=0] - Current simulated time in seconds
 */

/**
 * Time System class for managing game time
 */
class TimeSystem {
  /**
   * @param {TimeConfig} config
   */
  constructor(config = {}) {
    this.speed = config.speed || 1;
    this.currentTime = config.currentTime || 0;
  }

  update(deltaTime) {
    this.currentTime += deltaTime * this.speed;
  }
}

export default TimeSystem;
