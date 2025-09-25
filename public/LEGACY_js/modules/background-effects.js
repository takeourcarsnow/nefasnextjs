// Background Effects Module
// Handles subtle CRT glow and ambient background effects

class BackgroundEffects {
    constructor() {
        this.backgroundContainer = document.getElementById('matrix-rain');
        this.init();
    }

    init() {
        this.createCRTGlow();
        this.startAmbientEffects();
    }

    createCRTGlow() {
        if (!this.backgroundContainer) return;

        // Clear any existing content
        this.backgroundContainer.innerHTML = '';
        
        // Add CRT glow overlay
        const crtOverlay = document.createElement('div');
        crtOverlay.className = 'crt-glow-overlay';
        this.backgroundContainer.appendChild(crtOverlay);

        // Add subtle scan lines
        const scanLines = document.createElement('div');
        scanLines.className = 'crt-scan-lines';
        this.backgroundContainer.appendChild(scanLines);

        // ...ambient particles code removed...
    }

    // ...ambient particles method removed...

    startAmbientEffects() {
        // Subtle random CRT flicker effect
        this.crtFlickerInterval = null;
        const flickerFn = () => {
            if (document.hidden) return;
            const crtOverlay = document.querySelector('.crt-glow-overlay');
            if (crtOverlay && Math.random() < 0.05) {
                crtOverlay.style.animation = 'crt-flicker 0.1s ease-in-out';
                setTimeout(() => {
                    crtOverlay.style.animation = 'crt-glow 4s ease-in-out infinite alternate';
                }, 100);
            }
        };
        this.crtFlickerInterval = setInterval(flickerFn, 200);
        // Pause/resume on tab visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.crtFlickerInterval) {
                    clearInterval(this.crtFlickerInterval);
                    this.crtFlickerInterval = null;
                }
            } else {
                if (!this.crtFlickerInterval) {
                    this.crtFlickerInterval = setInterval(flickerFn, 200);
                }
            }
        });
    }

    // Adjust effects on window resize
    handleResize() {
        // CRT effect doesn't need resize handling as it uses percentage-based positioning
    }
}

export default BackgroundEffects;
