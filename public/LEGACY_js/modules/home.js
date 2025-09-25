// Fetch and render the latest content in different categories on the home tab
import { addDecryptingTextEffect, addTypewriterToStaticText } from './terminal.js';

export function initHomePosts() {
    // Apply effects to all headers and captions
    applyTextEffects();
    
    // Load content for each category
    loadLatestBlogs();
    loadLatestVideos();
    loadLatestPhotos();
    loadLatest3D();
    loadLatestWebdev();
}

function applyTextEffects() {
    const headerElements = document.querySelectorAll('#home-content .decrypt-text');
    const captionElements = document.querySelectorAll('#home-content .typewriter-text');
    
    // Apply decrypt effects to headers with staggered timing
    headerElements.forEach((element, index) => {
        element.textContent = '';
        element.style.visibility = 'hidden';
        setTimeout(() => {
            addDecryptingTextEffect(element, 0);
        }, 100 + (index * 200));
    });
    
    // Apply typewriter effects to captions with staggered timing
    captionElements.forEach((element, index) => {
        element.textContent = '';
        element.style.visibility = 'hidden';
        setTimeout(() => {
            addTypewriterToStaticText(element, 0);
        }, 800 + (index * 200));
    });
}

function loadLatestBlogs() {
    const grid = document.getElementById('home-blogs-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/data/posts.json')
        .then(res => res.json())
        .then(posts => {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = posts.slice(0, 3);
            grid.innerHTML = latest.map(post => `
                <a href="#" class="grid-item home-post-item" onclick="showSection('blog-content'); return false;" style="text-decoration:none;color:inherit;">
                    <div>
                        <p class="home-post-type">[BLOG]</p>
                        <h4 class="home-post-title">${post.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(post.date).toLocaleDateString()}</p>
                    </div>
                </a>`).join('');
        })
        .catch(err => console.error('Failed to load blog posts:', err));
}

function loadLatestVideos() {
    const grid = document.getElementById('home-videos-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/data/videos.json')
        .then(res => res.json())
        .then(videos => {
            videos.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = videos.slice(0, 3);
            grid.innerHTML = latest.map(video => `
                <a href="#" class="grid-item home-post-item" onclick="showSection('video-content'); return false;" style="text-decoration:none;color:inherit;">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[VIDEO]</p>
                        <h4 class="home-post-title">${video.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(video.date).toLocaleDateString()}</p>
                    </div>
                </a>`).join('');
        })
        .catch(err => console.error('Failed to load videos:', err));
}

function loadLatestPhotos() {
    const grid = document.getElementById('home-photos-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/data/photos.json')
        .then(res => res.json())
        .then(items => {
            // Sort by date descending
            items.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = items.slice(0, 3);
            grid.innerHTML = latest.map(item => {
                // Handle both albums and single photos
                const thumbnail = item.type === 'album' ? item.coverImage : item.thumbnail;
                const title = item.title;
                const typeLabel = item.type === 'album' ? '[ALBUM]' : '[PHOTO]';
                // Add data-album attribute and custom class for albums
                const albumAttr = item.type === 'album' ? `data-album="${encodeURIComponent(title)}"` : '';
                const albumClass = item.type === 'album' ? 'home-view-album-link' : '';
                return `
                <a href="#" class="grid-item home-post-item ${albumClass}" style="text-decoration:none;color:inherit;" ${albumAttr}>
                    <img src="${thumbnail}" alt="${title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">${typeLabel}</p>
                        <h4 class="home-post-title">${title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(item.date).toLocaleDateString()}</p>
                    </div>
                </a>`;
            }).join('');
            // Add click handlers for album links (now on the anchor itself)
            grid.querySelectorAll('.home-view-album-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const albumTitle = decodeURIComponent(this.getAttribute('data-album'));
                    showSection('photo-content');
                    if (window.showAlbumByTitle) {
                        setTimeout(() => window.showAlbumByTitle(albumTitle), 100); // wait for section to render
                    }
                });
            });
            // Add click handler for photo items (non-album)
            grid.querySelectorAll('.grid-item.home-post-item:not(.home-view-album-link)').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSection('photo-content');
                });
            });
        })
        .catch(err => console.error('Failed to load photos:', err));
}

function loadLatest3D() {
    const grid = document.getElementById('home-3d-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/data/3d.json')
        .then(res => res.json())
        .then(renders => {
            renders.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = renders.slice(0, 3);
            grid.innerHTML = latest.map(render => `
                <a href="#" class="grid-item home-post-item" onclick="showSection('3d-content'); return false;" style="text-decoration:none;color:inherit;">
                    <img src="${render.thumbnail}" alt="${render.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[3D]</p>
                        <h4 class="home-post-title">${render.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(render.date).toLocaleDateString()}</p>
                    </div>
                </a>`).join('');
        })
        .catch(err => console.error('Failed to load 3D renders:', err));
}

function loadLatestWebdev() {
    const grid = document.getElementById('home-webdev-grid');
    if (!grid || grid.children.length > 0) return;
    
    fetch('/data/webdev.json')
        .then(res => res.json())
        .then(projects => {
            projects.sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = projects.slice(0, 3);
            grid.innerHTML = latest.map(project => `
                <a href="#" class="grid-item home-post-item" onclick="showSection('webdev-content'); return false;" style="text-decoration:none;color:inherit;">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" decoding="async" style="width:100%;height:120px;object-fit:cover;margin-bottom:12px;border-radius:6px;">
                    <div>
                        <p class="home-post-type">[WEBDEV]</p>
                        <h4 class="home-post-title">${project.title}</h4>
                    </div>
                    <div>
                        <p class="home-post-date">${new Date(project.date).toLocaleDateString()}</p>
                    </div>
                </a>`).join('');
        })
        .catch(err => console.error('Failed to load webdev projects:', err));
}