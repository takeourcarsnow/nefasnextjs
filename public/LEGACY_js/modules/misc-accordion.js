// Handles accordion/expand for misc section categories
export function initMiscAccordion() {
    const miscSection = document.getElementById('misc-content');
    if (!miscSection) return;

    // Find all h3s that are direct children of misc-content
    const categoryHeaders = miscSection.querySelectorAll('h3');
    categoryHeaders.forEach(header => {
        // Find the next sibling that is a div (the category content)
        let next = header.nextElementSibling;
        if (!next || next.tagName !== 'DIV') return;

        // Set up initial state for content
        next.style.maxHeight = '0';
        next.style.overflow = 'hidden';
        next.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)';
        header.style.cursor = 'pointer';

        // Remove any old arrow chars from header text and trim
        header.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = node.textContent.replace(/[▼▲]/g, '').replace(/\s+$/, '');
            }
        });

        // Add/replace arrow span for animation, always after a single space
        let arrow = header.querySelector('.misc-accordion-arrow');
        if (!arrow) {
            arrow = document.createElement('span');
            arrow.className = 'misc-accordion-arrow';
            arrow.textContent = '▼';
            arrow.style.display = 'inline-block';
            arrow.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
            header.appendChild(document.createTextNode(' '));
            header.appendChild(arrow);
        } else {
            // Ensure there is exactly one space before the arrow
            if (arrow.previousSibling && arrow.previousSibling.nodeType === Node.TEXT_NODE) {
                arrow.previousSibling.textContent = arrow.previousSibling.textContent.replace(/\s*$/, ' ') ;
            } else {
                header.insertBefore(document.createTextNode(' '), arrow);
            }
        }

        // Click handler for accordion
        header.addEventListener('click', () => {
            const expanded = next.style.maxHeight !== '0px' && next.style.maxHeight !== '0';
            if (expanded) {
                next.style.maxHeight = '0';
                arrow.style.transform = 'rotate(0deg)';
            } else {
                next.style.maxHeight = next.scrollHeight + 'px';
                arrow.style.transform = 'rotate(180deg)';
            }
        });
    });
}
