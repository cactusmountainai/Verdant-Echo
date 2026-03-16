class TimeSystem {
    constructor() {
        this.isSleeping = false;
        this.sleepFadeDuration = 1500; // 1.5 seconds fade duration
        this.sleepInterval = null;
        this.onDayEndCallback = null;
        this.onDayStartCallback = null;
    }

    sleep() {
        if (this.isSleeping) return;

        this.isSleeping = true;
        
        // Trigger onDayEnd callback if defined
        if (this.onDayEndCallback) {
            this.onDayEndCallback();
        }
        
        // Fade out screen
        this.fadeOutScreen();
        
        // Simulate passage of time (e.g., overnight)
        setTimeout(() => {
            // Advance day/night cycle
            this.advanceTime();
            
            // Fade in screen
            this.fadeInScreen();
            
            // Trigger onDayStart callback if defined
            if (this.onDayStartCallback) {
                this.onDayStartCallback();
            }
            
            // Auto-save after sleep completes
            this.autoSave();
            
            this.isSleeping = false;
        }, 2000); // Simulated overnight duration (2 seconds for demo)
    }

    fadeOutScreen() {
        const overlay = document.createElement('div');
        overlay.id = 'sleep-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity ' + this.sleepFadeDuration + 'ms ease-in-out';
        
        document.body.appendChild(overlay);
        
        // Trigger fade out
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }

    fadeInScreen() {
        const overlay = document.getElementById('sleep-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            
            // Remove after fade out completes
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, this.sleepFadeDuration);
        }
    }

    advanceTime() {
        // This would normally advance the in-game time
        // For now, just increment day counter or trigger events
        console.log('Day advanced');
    }

    autoSave() {
        // Call save function from FarmScene or global store
        if (window.farmScene && typeof window.farmScene.saveGame === 'function') {
            window.farmScene.saveGame();
        } else if (typeof window.saveGame === 'function') {
            window.saveGame();
        }
        
        console.log('Auto-saved after sleep');
    }

    setOnDayEnd(callback) {
        this.onDayEndCallback = callback;
    }

    setOnDayStart(callback) {
        this.onDayStartCallback = callback;
    }
}

// Export instance for global use
export const timeSystem = new TimeSystem();
