class TimeSystem {
    constructor() {
        this.startTime = Date.now();
        this.timeScale = 1.0;
        this.lastUpdate = performance.now();
        this.isPaused = false;
    }

    getCurrentTime() {
        const now = performance.now();
        
        if (this.isPaused) {
            // When paused, time doesn't advance
            return new Date(this.startTime);
        }
        
        const elapsedSeconds = ((now - this.lastUpdate) / 1000) * this.timeScale;
        this.lastUpdate = now;
        
        return new Date(this.startTime + (elapsedSeconds * 1000));
    }

    setTimeScale(scale) {
        if (scale < 0) {
            throw new Error("Time scale cannot be negative");
        }
        this.timeScale = scale;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.lastUpdate = performance.now();
    }

    reset() {
        this.startTime = Date.now();
        this.lastUpdate = performance.now();
        this.isPaused = false;
    }
}

export default TimeSystem;
