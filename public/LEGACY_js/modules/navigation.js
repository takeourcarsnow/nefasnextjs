// This file has been split into smaller modules for better organization:
// - content.js: Contains all content data (merged from section-data.js)
// - typing-animation.js: Contains the typing animation functionality  
// - section-manager.js: Contains section switching logic

// Re-export for backward compatibility
export { sectionContent } from './content.js';
export { typeContent } from './typing-animation.js';
export { showSection } from './section-manager.js';
