// viewer.js - Global modal/gallery controller for all media types (photos, 3D, etc.)
// Usage: import { showViewerModal } from './viewer.js';

export function showViewerModal(item, itemsArr = null, startIndex = null) {
    // Remove any existing modal
    const oldModal = document.querySelector('.global-viewer-modal');
    if (oldModal) document.body.removeChild(oldModal);

    let currentIndex = startIndex;
    let arr = Array.isArray(itemsArr) ? itemsArr : null;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'global-viewer-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        animation: none !important;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        position: relative;
        background: none;
    `;

    // Fallbacks for missing fields
    const image = item.image || item.thumbnail || '';
    const title = item.title || '';
    const description = item.description || '';
    const tags = Array.isArray(item.tags) ? item.tags.map(tag => `#${tag}`).join(' ') : '';
    let date = '';
    if (item.date) {
        try {
            date = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { date = ''; }
    }

    // Zoom state
    let zoom = 1;
    function updateControlsVisibility() {
        const closeBtn = modalContent.querySelector('.close-photo-modal');
        const prevBtn = modalContent.querySelector('.prev-photo');
        const nextBtn = modalContent.querySelector('.next-photo');
        if (zoom > 1) {
            if (closeBtn) closeBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (closeBtn) closeBtn.style.display = '';
            if (prevBtn) prevBtn.style.display = '';
            if (nextBtn) nextBtn.style.display = '';
        }
    }

    modalContent.innerHTML = `
        <button class="close-photo-modal" style="position:fixed;top:24px;right:32px;background:none;border:none;color:#00ff9d;font-size:2.1em;padding:2px 10px;cursor:pointer;z-index:10001;outline:none;line-height:1;">×</button>
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;">
            ${arr ? `<div style='position:absolute;left:-70px;top:50%;transform:translateY(-50%);z-index:10002;'>
                <button class=\"prev-photo\" style=\"background:none;border:none;color:#00ff9d;font-size:2.5em;cursor:pointer;outline:none;line-height:1;padding:0;\">◀</button>
            </div>` : ''}
            <img class="modal-photo-img" src="${image}" alt="${title}"
                style="max-width:100vw;max-height:80vh;object-fit:contain;border-radius:8px;transform:scale(1);transition:transform 0.2s;cursor:zoom-in;z-index:10001;">
            ${arr ? `<div style='position:absolute;right:-70px;top:50%;transform:translateY(-50%);z-index:10002;'>
                <button class=\"next-photo\" style=\"background:none;border:none;color:#00ff9d;font-size:2.5em;cursor:pointer;outline:none;line-height:1;padding:0;\">▶</button>
            </div>` : ''}
        </div>
        <div style="color: white; margin-top: 18px; text-align: center; max-width: 90vw;">
            <h3 style="margin: 0 0 5px 0; color: #00ff9d;text-shadow:0 0 8px #00ff9d,0 0 2px #fff;">${title}</h3>
            <p style="margin: 0 0 10px 0; color: #ccc; font-size:1.1em; background:rgba(0,0,0,0.5); display:inline-block; padding:4px 16px; border-radius:6px;">${description}</p>
            <div style="font-size: 0.9em; color: #666;">
                ${date}${tags ? ' • ' + tags : ''}
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Prevent modal close on content click
    modalContent.addEventListener('click', e => e.stopPropagation());
    // Close modal on overlay click or close button
    modal.addEventListener('click', () => document.body.removeChild(modal));
    modalContent.querySelector('.close-photo-modal').addEventListener('click', () => document.body.removeChild(modal));

    const img = modalContent.querySelector('.modal-photo-img');
    let panX = 0, panY = 0, isDragging = false, startX = 0, startY = 0, lastPanX = 0, lastPanY = 0;
    function clampPan() {
        // Only clamp if zoomed in
        if (zoom <= 1) {
            panX = 0;
            panY = 0;
            return;
        }
        // Get image and container sizes
        const container = modalContent.querySelector('div[style*="position:relative"]');
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        // Clamp based on the actual displayed size of the image (after CSS and zoom)
        // This ensures the image cannot be panned out of view, regardless of aspect ratio or zoom
        // Get the actual displayed size of the image (after CSS and zoom)
        const imgRect = img.getBoundingClientRect();
        // Add a margin so the image never reaches the exact edge
        // User wants much earlier clamping on left/right, so increase margin
        const marginX = Math.max(0.32 * containerRect.width, 180); // clamp even earlier (32% of container or at least 180px)
        const marginY = 64; // keep top/bottom as before
        const offsetX = Math.max(0, (imgRect.width - containerRect.width) / 2 - marginX);
        const offsetY = Math.max(0, (imgRect.height - containerRect.height) / 2 - marginY);
        // Only allow panning if the image is larger than the container in that axis
        if (imgRect.width > containerRect.width + marginX * 2) {
            panX = Math.min(offsetX, Math.max(panX, -offsetX));
        } else {
            panX = 0;
        }
        if (imgRect.height > containerRect.height + marginY * 2) {
            panY = Math.min(offsetY, Math.max(panY, -offsetY));
        } else {
            panY = 0;
        }
    }
    function updateTransform() {
        clampPan();
        img.style.transform = `scale(${zoom}) translate(${panX}px, ${panY}px)`;
        img.style.cursor = zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }
    let wasDragging = false;
    let tapTimeout = null;
    let dragReady = false;
    let pinchStartDist = null;
    let pinchStartZoom = 1;
    let pinchMidpoint = null;
    // Mouse events (desktop)
    img.addEventListener('mousedown', (e) => {
        if (zoom === 1) return;
        isDragging = true;
        wasDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        lastPanX = panX;
        lastPanY = panY;
        pendingPan = null;
        img.style.cursor = 'grabbing';
        e.preventDefault();
    });
    // Use requestAnimationFrame for smooth panning
    let rafId = null;
    let pendingPan = null;
    function schedulePanUpdate(x, y) {
        pendingPan = { x, y };
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                if (pendingPan) {
                    panX = lastPanX + (pendingPan.x - startX);
                    panY = lastPanY + (pendingPan.y - startY);
                    if (Math.abs(pendingPan.x - startX) > 2 || Math.abs(pendingPan.y - startY) > 2) {
                        wasDragging = true;
                    }
                    updateTransform();
                }
                rafId = null;
            });
        }
    }
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        schedulePanUpdate(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', (e) => {
        if (isDragging && !wasDragging && zoom > 1) {
            // treat as click, do nothing (let click handler run)
        }
        // On mouseup, update lastPanX/lastPanY to the final pan position
        if (pendingPan) {
            lastPanX = panX;
            lastPanY = panY;
            pendingPan = null;
        }
        isDragging = false;
        if (zoom > 1) img.style.cursor = 'grab';
    });
    img.addEventListener('click', (e) => {
        if (wasDragging) {
            wasDragging = false;
            return;
        }
        if (zoom === 1) {
            zoom = 2;
        } else {
            zoom = 1;
            panX = 0;
            panY = 0;
        }
        updateTransform();
        updateControlsVisibility();
    });
    img.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoom = Math.min(zoom + 0.1, 3);
        } else {
            zoom = Math.max(zoom - 0.1, 1);
        }
        if (zoom === 1) {
            panX = 0;
            panY = 0;
        }
        updateTransform();
        updateControlsVisibility();
    });
    // Touch events (mobile)
    img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            dragReady = false;
            if (tapTimeout) {
                clearTimeout(tapTimeout);
                tapTimeout = null;
                // Double tap detected
                if (zoom === 1) {
                    zoom = 2;
                } else {
                    zoom = 1;
                    panX = 0;
                    panY = 0;
                }
                updateTransform();
                updateControlsVisibility();
                e.preventDefault();
                return;
            }
            // Wait to see if a second tap comes in 350ms
            tapTimeout = setTimeout(() => {
                tapTimeout = null;
                // Single tap does nothing, but if zoomed in, allow drag to pan
                if (zoom > 1 && dragReady) {
                    isDragging = true;
                    wasDragging = false;
                    const touch = dragReady;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    lastPanX = panX;
                    lastPanY = panY;
                }
                dragReady = false;
            }, 350);
            // Store touch for possible drag if no double-tap
            if (zoom > 1) {
                dragReady = e.touches[0];
            }
            e.preventDefault();
        } else if (e.touches.length === 2) {
            // Pinch start
            isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinchStartDist = Math.sqrt(dx * dx + dy * dy);
            pinchStartZoom = zoom;
            pinchMidpoint = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
        }
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1 && isDragging && zoom > 1) {
            const touch = e.touches[0];
            schedulePanUpdate(touch.clientX, touch.clientY);
        } else if (e.touches && e.touches.length === 2 && pinchStartDist) {
            // Pinch to zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let newZoom = pinchStartZoom * (dist / pinchStartDist);
            newZoom = Math.max(1, Math.min(newZoom, 3));
            zoom = newZoom;
            if (zoom === 1) {
                panX = 0;
                panY = 0;
            }
            updateTransform();
            updateControlsVisibility();
        }
    }, { passive: false });
    window.addEventListener('touchend', (e) => {
        if (pendingPan) {
            lastPanX = panX;
            lastPanY = panY;
            pendingPan = null;
        }
        isDragging = false;
        pinchStartDist = null;
        if (zoom > 1) img.style.cursor = 'grab';
    });
    // Swipe down to close when zoomed out (mobile)
    let swipeStartY = null;
    img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && zoom === 1) {
            swipeStartY = e.touches[0].clientY;
        }
    });
    img.addEventListener('touchend', (e) => {
        if (swipeStartY !== null && zoom === 1 && e.changedTouches.length === 1) {
            const endY = e.changedTouches[0].clientY;
            if (endY - swipeStartY > 80) {
                // Swipe down detected
                document.body.removeChild(modal);
            }
        }
        swipeStartY = null;
    });
    // Initial controls visibility
    updateControlsVisibility();

    // Navigation (if context)
    if (arr && typeof currentIndex === 'number') {
        const showAt = (idx) => {
            // Loop around
            const len = arr.length;
            const newIdx = ((idx % len) + len) % len;
            showViewerModal(arr[newIdx], arr, newIdx);
        };
        // Next/Prev buttons (desktop)
        const nextBtn = modalContent.querySelector('.next-photo');
        const prevBtn = modalContent.querySelector('.prev-photo');
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showAt(currentIndex + 1);
            });
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showAt(currentIndex - 1);
            });
        }
        // Keyboard navigation (desktop)
        const handleKey = (e) => {
            if (e.key === 'ArrowRight') {
                showAt(currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                showAt(currentIndex - 1);
            } else if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleKey);
            }
        };
        document.addEventListener('keydown', handleKey);

        // Swipe navigation (mobile/touch devices, always enabled if zoomed out)
        const isMobile = 'ontouchstart' in window && window.innerWidth <= 900;
        let swipeX = null, swipeY = null, swipeMoved = false;
        img.addEventListener('touchstart', (e) => {
            if (!isMobile || zoom !== 1 || e.touches.length !== 1) return;
            swipeX = e.touches[0].clientX;
            swipeY = e.touches[0].clientY;
            swipeMoved = false;
        });
        img.addEventListener('touchmove', (e) => {
            if (!isMobile || zoom !== 1 || swipeX === null || swipeY === null) return;
            if (e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - swipeX;
            const dy = e.touches[0].clientY - swipeY;
            if (!swipeMoved && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
                swipeMoved = true;
            }
        });
        img.addEventListener('touchend', (e) => {
            if (!isMobile || zoom !== 1 || swipeX === null || swipeY === null) return;
            if (!swipeMoved) { swipeX = swipeY = null; return; }
            const touch = (e.changedTouches && e.changedTouches[0]) || null;
            if (!touch) { swipeX = swipeY = null; return; }
            const dx = touch.clientX - swipeX;
            const dy = touch.clientY - swipeY;
            // Only trigger if horizontal swipe and not a vertical swipe (to not conflict with swipe down to close)
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) {
                    showAt(currentIndex + 1);
                } else {
                    showAt(currentIndex - 1);
                }
            }
            swipeX = swipeY = null;
        });

        // Tap left/right side of image to go prev/next (mobile, zoomed out)
        img.addEventListener('touchend', (e) => {
            if (!isMobile || zoom !== 1 || swipeMoved) return;
            if (e.changedTouches && e.changedTouches.length === 1) {
                const touch = e.changedTouches[0];
                const rect = img.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                // 0.35 left, 0.65 right, middle does nothing
                if (x < rect.width * 0.35) {
                    showAt(currentIndex - 1);
                } else if (x > rect.width * 0.65) {
                    showAt(currentIndex + 1);
                }
            }
        });
    } else {
        // Escape key for single item
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}
