// videos.js - Loads and displays videos in the video tab
export function initVideos() {
    const videoGallery = document.getElementById('video-gallery');
    if (!videoGallery) return;

    // Load videos from JSON
    fetch('/data/videos.json')
        .then(response => response.json())
        .then(videos => {
            if (videos && videos.length > 0) {
                displayVideoItems(videos, videoGallery);
            } else {
                videoGallery.innerHTML = '<p style="color: #ff0000;">[ERROR] No videos found</p>';
            }
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            videoGallery.innerHTML = '<p style="color: #ff0000;">[ERROR] Failed to load video database</p>';
        });
}

function displayVideoItems(videos, container) {
    container.innerHTML = '';
    videos.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = videos.slice(0, 3);
    latest.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'grid-item video-item';
        videoItem.innerHTML = `
            <div class="video-meta">
                <iframe width="100%" height="220" src="https://www.youtube.com/embed/${video.embedId}" title="${video.title}" frameborder="0" allowfullscreen style="border-radius:6px;"></iframe>
                <h3 style="margin:12px 0 6px 0;">${video.title}</h3>
                <p style="margin:0 0 6px 0;color:#aaa;">${video.description || ''}</p>
                <p style="margin:6px 0 0 0;font-size:0.9em;color:#00ff9d;">${new Date(video.date).toLocaleDateString()}</p>
            </div>
        `;
        container.appendChild(videoItem);
    });
}
