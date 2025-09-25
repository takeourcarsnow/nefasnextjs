const loadingMessages = [
    'Waking up the bots...',
    'Loading bytes...',
    'Tuning circuits...',
    'Mixing code...',
    'Adjusting settings...',
    'Spinning gears...',
    'Connecting dots...',
    'Crunching numbers...',
    'Almost cooked...',
];

const generateFrame = (progress) => {
    const width = 24;
    const filled = Math.floor(width * progress);
    const empty = width - filled;
    const percentage = Math.floor(progress * 100);
    const messageIndex = Math.min(Math.floor(progress * loadingMessages.length), loadingMessages.length - 1);
    const message = loadingMessages[messageIndex];
    
    // Always reserve space for the completion message to prevent jumping
    const completionLine = progress >= 1 ? '...All systems go!' : ' ';
    return `nefas.tv v1.0\n\n[${'='.repeat(filled)}>${' '.repeat(empty)}] ${percentage}%\n\n${message}\n${completionLine}`;
};

// Pre-generate frames for better performance
export const preloaderFrames = Array.from({ length: 50 }, (_, i) => generateFrame(i / 49));


export const initPreloader = (preloader, siteContainer, onComplete) => {
    if (!preloader) {
        console.warn('Preloader element not found');
        return;
    }

    let frameIndex = 0;
    const preloaderFrameCount = preloaderFrames.length;
    document.body.style.overflow = 'hidden';
    preloader.style.willChange = 'opacity, transform';
    const preloaderText = preloader.querySelector('#preloader-text');

    // Organic progress variables
    let progress = 0;
    let lastFrameIndex = 0;
    let completed = false;

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function triggerLogoAnimation() {
    }

    // Failsafe: force preloader to complete after 10 seconds
    const failsafeTimeout = setTimeout(() => {
        if (!completed) {
            completed = true;
            if (preloaderText) {
                preloaderText.textContent = preloaderFrames[preloaderFrameCount - 1];
            }
            if (onComplete) {
                onComplete();
            }
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transform = 'scale(0.95)';
                preloader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                if (siteContainer) {
                    siteContainer.style.opacity = '1';
                    siteContainer.style.transform = 'scale(1)';
                    siteContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    siteContainer.style.willChange = 'opacity, transform';
                }
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('preloader-complete');
                    document.body.style.overflow = '';
                    preloader.style.willChange = 'auto';
                    if (siteContainer) {
                        siteContainer.style.willChange = 'auto';
                    }
                }, 800);
            }, 500);
        }
    }, 6000); // 6 seconds

    const animatePreloader = () => {
        if (completed) return;
        // Calculate organic progress
        let t = progress / (preloaderFrameCount - 1);
        // Easing for the last 20% to slow down
        if (t > 0.8) {
            t = 0.8 + 0.2 * easeOutQuad((t - 0.8) / 0.2);
        }
        // Add some randomness to the increment
        let increment = 1 + Math.floor(Math.random() * 2); // 1 or 2 frames
        // Occasionally jump ahead
        if (Math.random() < 0.08 && progress < preloaderFrameCount - 10) {
            increment += Math.floor(Math.random() * 3); // burst
        }
        // Occasionally pause
        let delay = 40 + Math.random() * 60; // 40-100ms
        if (Math.random() < 0.12) {
            delay += Math.random() * 200; // extra pause
        }
        // Slow down near the end
        if (progress > preloaderFrameCount * 0.85) {
            delay += 120 * (progress / preloaderFrameCount);
        }

        // Update frame index based on organic progress
        let frameIndex = Math.min(Math.floor(t * (preloaderFrameCount - 1)), preloaderFrameCount - 1);
        // Ensure frameIndex never goes backwards
        if (frameIndex < lastFrameIndex) {
            frameIndex = lastFrameIndex;
        }
        lastFrameIndex = frameIndex;
        if (preloaderText) {
            preloaderText.textContent = preloaderFrames[frameIndex];
        }
        // ...existing code...

        if (frameIndex >= preloaderFrameCount - 1) {
            if (!completed) {
                completed = true;
                clearTimeout(failsafeTimeout);
                if (preloaderText) {
                    preloaderText.textContent = preloaderFrames[preloaderFrameCount - 1];
                }
                if (onComplete) {
                    onComplete();
                }
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.transform = 'scale(0.95)';
                    preloader.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    if (siteContainer) {
                        siteContainer.style.opacity = '1';
                        siteContainer.style.transform = 'scale(1)';
                        siteContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        siteContainer.style.willChange = 'opacity, transform';
                    }
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        document.body.classList.add('preloader-complete');
                        document.body.style.overflow = '';
                        preloader.style.willChange = 'auto';
                        if (siteContainer) {
                            siteContainer.style.willChange = 'auto';
                        }
                    }, 800);
                }, 500);
            }
            return;
        }

        progress += increment;
        setTimeout(() => requestAnimationFrame(animatePreloader), delay);
    };

    animatePreloader();
};
