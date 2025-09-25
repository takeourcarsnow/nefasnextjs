export const leftFrames = ['[>', '[>', '[ >', '[>'];
export const rightFrames = ['<]', ' <]', '< ]', '<]'];

// Glitch characters for the cryptic effect
const glitchChars = ['#', '@', '$', '%', '&', '*', '!', '?', '0', '1', 'X', 'Z', 'Q'];
const originalText = 'nefas.tv';

export const initScrollingText = () => {
    const scrollingText = document.querySelector('.scroll-content');
    if (!scrollingText) return;
    
    // Add subtle flicker effect to simulate LED display
    let flickerInterval, brightnessInterval;
    const flickerFn = () => {
        if (document.hidden) return;
        if (Math.random() < 0.05) {
            scrollingText.style.opacity = '0.7';
            setTimeout(() => {
                scrollingText.style.opacity = '1';
            }, 50 + Math.random() * 100);
        }
    };
    const brightnessFn = () => {
        if (document.hidden) return;
        if (Math.random() < 0.1) {
            scrollingText.style.textShadow = '0 0 8px var(--main-color), 0 0 15px var(--glow-color), 0 0 20px var(--glow-color)';
            setTimeout(() => {
                scrollingText.style.textShadow = '0 0 3px var(--main-color), 0 0 6px var(--glow-color), 0 0 9px var(--glow-color)';
            }, 200 + Math.random() * 300);
        }
    };
    flickerInterval = setInterval(flickerFn, 500);
    brightnessInterval = setInterval(brightnessFn, 1000);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(flickerInterval);
            clearInterval(brightnessInterval);
        } else {
            flickerInterval = setInterval(flickerFn, 500);
            brightnessInterval = setInterval(brightnessFn, 1000);
        }
    });
    
    // Occasionally change text brightness for LED effect
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            scrollingText.style.textShadow = '0 0 8px var(--main-color), 0 0 15px var(--glow-color), 0 0 20px var(--glow-color)';
            setTimeout(() => {
                scrollingText.style.textShadow = '0 0 3px var(--main-color), 0 0 6px var(--glow-color), 0 0 9px var(--glow-color)';
            }, 200 + Math.random() * 300);
        }
    }, 1000);
};

export const initHeaderAnimation = (asciiHeader, asciiHeaderRight) => {
    let headerFrameIndex = 0;
    let headerInterval;
    const headerFn = () => {
        if (document.hidden) return;
        if (asciiHeader) asciiHeader.textContent = leftFrames[headerFrameIndex];
        if (asciiHeaderRight) asciiHeaderRight.textContent = rightFrames[headerFrameIndex];
        headerFrameIndex = (headerFrameIndex + 1) % leftFrames.length;
    };
    headerInterval = setInterval(headerFn, 800);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(headerInterval);
        } else {
            headerInterval = setInterval(headerFn, 800);
        }
    });
};


export const initGlitchEffect = (titleElement) => {
    if (!titleElement) return;

    // Store references to the ASCII elements so we don't lose them
    const asciiHeader = titleElement.querySelector('#ascii-header');
    const asciiHeaderRight = titleElement.querySelector('#ascii-header-right');

    let glitchTimeout;
    let running = true;

    function glitchFn() {
        if (!running || document.hidden) return;

        // 50% chance to glitch, 50% to show original
        if (Math.random() < 0.5) {
            const textArray = originalText.split('');
            // Randomize number of chars to glitch: 1 to 4
            const numCharsToGlitch = 1 + Math.floor(Math.random() * 4);
            // Use a Set to avoid glitching the same char twice
            const indices = new Set();
            while (indices.size < numCharsToGlitch) {
                indices.add(Math.floor(Math.random() * textArray.length));
            }
            indices.forEach(idx => {
                textArray[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            });
            titleElement.textContent = textArray.join('');
            // Restore ASCII headers
            if (asciiHeader) asciiHeader.textContent = leftFrames[0];
            if (asciiHeaderRight) asciiHeaderRight.textContent = rightFrames[0];
        } else {
            // Restore original text
            titleElement.textContent = originalText;
        }

        // Next glitch after a random delay (600–1200ms)
        const nextDelay = 600 + Math.random() * 600;
        glitchTimeout = setTimeout(glitchFn, nextDelay);
    }

    glitchFn();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            running = false;
            clearTimeout(glitchTimeout);
        } else {
            if (!running) {
                running = true;
                glitchFn();
            }
        }
    });
};
