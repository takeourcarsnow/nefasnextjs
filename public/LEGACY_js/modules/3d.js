// Module for loading and displaying 3D renders
import { showViewerModal } from './viewer.js';
export function init3D() {
    const renderGallery = document.getElementById('3d-gallery');
    if (!renderGallery) return;

    // Load 3D renders from JSON
    fetch('/data/3d.json')
        .then(response => response.json())
        .then(renders => {
            if (renders && renders.length > 0) {
                display3DRenders(renders, renderGallery);
            }
        })
        .catch(error => {
            console.error('Error loading 3D renders:', error);
            renderGallery.innerHTML = '<p style="color: #ff0000;">[ERROR] Failed to load 3D render database</p>';
        });
}

function display3DRenders(renders, container) {
    container.innerHTML = '';
    
    renders.forEach((render, idx) => {
        const renderItem = document.createElement('div');
        renderItem.className = 'grid-item d3-item';
        renderItem.innerHTML = `
            <img src="${render.thumbnail}" 
                 alt="${render.title}" 
                 decoding="async" 
                 style="cursor: pointer; opacity: 1; display: block;"
                 data-full-image="${render.image}"
                 data-title="${render.title}"
                 data-description="${render.description}">
            <p class="d3-caption">> ${render.title}</p>
        `;
        // Add click event to show full image in modal, with navigation
        const img = renderItem.querySelector('img');
        img.addEventListener('click', () => {
            showViewerModal(render, renders, idx);
        });
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        });
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        }, 100);
        container.appendChild(renderItem);
    });
}

// ...global viewer handles modal logic...
