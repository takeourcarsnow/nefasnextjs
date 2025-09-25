export const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
};

export const createTypeWriter = (terminalOutput, terminalLines) => {
    if (!terminalOutput || !Array.isArray(terminalLines)) {
        console.error('Invalid parameters for createTypeWriter');
        return () => Promise.resolve();
    }

    return async () => {
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (const line of terminalLines) {
            if (!line.text || line.text.trim() === '') continue; // Skip empty lines

            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            lineElement.style.color = line.color || '#00ff9d';

            if (line.text) {
                const timestamp = document.createElement('span');
                timestamp.style.color = '#00ffff';
                timestamp.textContent = getTimestamp() + ' ';
                lineElement.appendChild(timestamp);
            }

            // Add to fragment first, then append to DOM for better performance
            fragment.appendChild(lineElement);
            terminalOutput.appendChild(fragment);

            // Create a cursor element that will move with the text
            const cursor = document.createElement('span');
            cursor.textContent = '▋';
            cursor.style.animation = 'cursor-blink 1s infinite';
            cursor.style.marginLeft = '1px';
            lineElement.appendChild(cursor);

            // Remove any previous cursor from last line
            const previousLine = lineElement.previousElementSibling;
            if (previousLine) {
                const previousCursor = previousLine.querySelector('span[data-cursor]');
                if (previousCursor) previousCursor.remove();
            }
            cursor.dataset.cursor = 'true'; // Mark this as a cursor for easy finding

            // Type each character with human-like variations
            const textContent = document.createElement('span');
            lineElement.insertBefore(textContent, cursor);
            
            for (let i = 0; i < line.text.length; i++) {
                const char = line.text[i];
                // Base typing speed with natural variation - much faster
                let delay = Math.random() * 3 + 3; // Much faster: Random delay between 3-6ms

                // Brief pauses for punctuation and spaces
                if ('.!?,'.includes(char)) {
                    delay += 10; // Reduced pause at punctuation
                } else if (' '.includes(char)) {
                    delay += 3; // Reduced pause at spaces
                }

                // Rare brief pauses - reduced frequency for better performance
                if (Math.random() < 0.01) { // 1% chance (reduced from 3%)
                    delay += Math.random() * 20; // 0-20ms pause (reduced from 50ms)
                }

                await new Promise(resolve => setTimeout(resolve, delay));

                // Update text content directly for better performance
                textContent.textContent += char;
            }

            // Handle cursor for the last line
            if (line === terminalLines[terminalLines.length - 1]) {
                // Keep the existing cursor for the last line
                cursor.dataset.finalCursor = 'true';
            } else {
                // Remove the cursor after the line is complete
                await new Promise(resolve => setTimeout(resolve, line.delay));
                cursor.remove();
            }

            await new Promise(resolve => setTimeout(resolve, line.delay));
        }
    };
};

// Function to add typewriter effect to static captions while keeping them in place
export const addTypewriterToStaticText = async (element, delay = 0, text = null) => {
    if (!element) return;
    
    // Use provided text or get from element's data attribute or current content
    const originalText = text || element.dataset.originalText || element.textContent;
    
    // Wait for the delay before starting
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Ensure the element is visible and empty
    element.style.visibility = 'visible';
    element.textContent = '';
    
    // Type each character
    for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];
        // Base typing speed with natural variation
        let typingDelay = Math.random() * 5 + 8; // Random delay between 8-13ms
        
        // Brief pauses for punctuation and spaces
        if ('.!?,'.includes(char)) {
            typingDelay += 15; // Pause at punctuation
        } else if (' '.includes(char)) {
            typingDelay += 5; // Pause at spaces
        }
        
        // Rare brief pauses for natural feel
        if (Math.random() < 0.02) { // 2% chance
            typingDelay += Math.random() * 30; // 0-30ms pause
        }
        
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        element.textContent += char;
    }
};

// Function to add decrypting/scrambling text effect to headers
export const addDecryptingTextEffect = async (element, delay = 0, text = null) => {
    if (!element) return;
    
    // Use provided text or get from element's data attribute or current content
    const originalText = text || element.dataset.originalText || element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
    
    // Wait for the delay before starting
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Ensure the element is visible
    element.style.visibility = 'visible';
    
    // Start with scrambled text
    let scrambledText = originalText.split('').map(char => {
        if (char === ' ' || char === '>' || char === '<') return char; // Keep spaces and symbols
        return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    
    element.textContent = scrambledText;
    
    // Gradually reveal the correct characters
    const revealDuration = 1000; // Total time for decryption
    const frames = 30; // Number of animation frames
    const frameDelay = revealDuration / frames;
    
    for (let frame = 0; frame <= frames; frame++) {
        const progress = frame / frames;
        const revealCount = Math.floor(progress * originalText.length);
        
        let currentText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (i < revealCount) {
                // Character is revealed
                currentText += originalText[i];
            } else if (originalText[i] === ' ' || originalText[i] === '>' || originalText[i] === '<') {
                // Keep spaces and symbols
                currentText += originalText[i];
            } else {
                // Still scrambled
                currentText += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        element.textContent = currentText;
        
        if (frame < frames) {
            await new Promise(resolve => setTimeout(resolve, frameDelay));
        }
    }
    
    // Ensure final text is correct
    element.textContent = originalText;
};
