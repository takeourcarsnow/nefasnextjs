import { sectionContent } from './content.js';
import { typeContent } from './typing-animation.js';
import { addDecryptingTextEffect, addTypewriterToStaticText } from './terminal.js';

// Track which sections have been loaded to avoid re-loading
const loadedSections = new Set();

/**
 * Applies decrypting effect to section headers and typewriter effect to description paragraphs
 * @param {HTMLElement} section - The section element to animate captions in
 */
const animateStaticCaptions = async (section) => {
    if (!section) return;
    
    // Wait a bit after terminal typing completes
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // First, animate the header with decrypting effect
    const header = section.querySelector('h2');
    if (header) {
        const originalHeaderText = header.dataset.originalText || header.textContent;
        await addDecryptingTextEffect(header, 0, originalHeaderText);
    }
    
    // Then, animate the description paragraph with typewriter effect
    const captionSelectors = {
        'video-content': 'p:not(.video-caption)', // Main description paragraph
        'photo-content': 'p:first-of-type', // Main description paragraph
        '3d-content': 'p:first-of-type', // Main description paragraph
        'webdev-content': 'p:first-of-type', // Main description paragraph
        'misc-content': 'p:first-of-type' // Main description paragraph
    };
    
    const sectionId = section.id;
    const selector = captionSelectors[sectionId];
    
    if (selector) {
        const caption = section.querySelector(selector);
        if (caption) {
            const originalCaptionText = caption.dataset.originalText || caption.textContent;
            // Wait a moment after header animation, then start typewriter
            await new Promise(resolve => setTimeout(resolve, 300));
            await addTypewriterToStaticText(caption, 0, originalCaptionText);
        }
    }
};

/**
 * Prepares both headers and description paragraphs for animation
 * @param {HTMLElement} section - The section element
 */
const prepareStaticCaptions = (section) => {
    if (!section) return;
    
    // Prepare the header
    const header = section.querySelector('h2');
    if (header) {
        header.dataset.originalText = header.textContent;
        header.textContent = '';
    }
    
    // Prepare the description paragraph
    const captionSelectors = {
        'video-content': 'p:not(.video-caption)',
        'photo-content': 'p:first-of-type',
        '3d-content': 'p:first-of-type',
        'webdev-content': 'p:first-of-type',
        'misc-content': 'p:first-of-type'
    };
    
    const sectionId = section.id;
    const selector = captionSelectors[sectionId];
    
    if (selector) {
        const caption = section.querySelector(selector);
        if (caption) {
            caption.dataset.originalText = caption.textContent;
            caption.textContent = '';
        }
    }
};

/**
 * Shows a specific section and handles navigation state
 * @param {string} sectionId - The ID of the section to show
 * @param {NodeList} contentSections - All content sections
 * @param {NodeList} navLinks - All navigation links
 */
export const showSection = (sectionId, contentSections, navLinks) => {
    contentSections.forEach(section => section.style.display = 'none');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    const activeLink = document.querySelector(`nav a[data-section="${sectionId}"]`);
    
    if (activeSection) {
        activeSection.style.display = 'block';
        
        // Check if this section has already been loaded
        const isAlreadyLoaded = loadedSections.has(sectionId);
        
        if (!isAlreadyLoaded) {
            // Mark this section as loaded
            loadedSections.add(sectionId);
            
            // Clear previous terminal content only for first load
            const oldTerminal = activeSection.querySelector('.terminal-output');
            if (oldTerminal) {
                oldTerminal.remove();
            }

            // Prepare static captions by storing their text and clearing content
            prepareStaticCaptions(activeSection);

            // Add CSS class to forcefully hide all content during typing
            activeSection.classList.add('typing-in-progress');

            // Handle different section types
            if (sectionId === 'blog-content') {
                // Blog section is handled specially in main.js initBlogSection function
                // Content will be shown after the special blog typing completes
            } else if (sectionContent[sectionId]) {
                // Sections with terminal typing - content will be shown after typing completes
                typeContent(activeSection, sectionContent[sectionId]).then(() => {
                    // After terminal typing completes, animate the static captions
                    animateStaticCaptions(activeSection);
                });
            } else {
                // Sections without terminal typing - remove class and show immediately
                setTimeout(() => {
                    activeSection.classList.remove('typing-in-progress');
                    // Still animate captions for sections without terminal content
                    animateStaticCaptions(activeSection);
                }, 100);
            }
        }
        // If already loaded, just show the section without re-running animations
    }
    if (activeLink) activeLink.classList.add('active');
};

/**
 * Reset a section's loaded state to force re-initialization on next visit
 * @param {string} sectionId - The ID of the section to reset
 */
export const resetSection = (sectionId) => {
    loadedSections.delete(sectionId);
};

/**
 * Reset all sections' loaded state
 */
export const resetAllSections = () => {
    loadedSections.clear();
};
