export const initWinampPlayer = async () => {
    // Pause/resume visualizer on tab visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            if (isPlaying) {
                updateVisualizer();
            }
        }
    });

    // Helper to check if visualizer is visible (not display:none or hidden)
    function isVisualizerVisible() {
        if (!visualizer) return false;
        const style = window.getComputedStyle(visualizer);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }
    const winamp = document.getElementById('winamp');
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const timeDisplay = document.getElementById('winamp-time');
    const songTitle = document.getElementById('winamp-song-title');
    const visualizer = document.getElementById('winamp-visualizer');
    
    // Early return if elements don't exist
    if (!winamp || !audio || !playBtn || !pauseBtn || !stopBtn || !prevBtn || !nextBtn || !timeDisplay || !songTitle || !visualizer) {
        console.warn('Winamp player elements not found');
        return;
    }
    
    // Playlist management
    let playlist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    let animationFrameId = null;
    
    // Load playlist from JSON file
    const loadPlaylist = async () => {
        try {
            const response = await fetch('data/playlist.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            playlist = await response.json();
            
            if (playlist.length > 0) {
                loadTrack(0);
            } else {
                songTitle.textContent = 'No tracks available';
            }
        } catch (error) {
            console.error('Failed to load playlist:', error);
            songTitle.textContent = 'Failed to load playlist';
            
            // Fallback to the original single track
            playlist = [{
                id: 'vaporwave',
                title: 'Vaporwave',
                file: 'audio/vaporwave.mp3'
            }];
            loadTrack(0);
        }
    };
    
    // Load a specific track
    const loadTrack = (index) => {
        if (index < 0 || index >= playlist.length) return;
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        audio.src = track.file;
        songTitle.textContent = track.title;
        
        // Reset time display
        timeDisplay.textContent = '00:00';
        
        // Reset visualizer
        visBars.forEach(bar => {
            bar.style.height = '0%';
        });
    };
    
    // Navigation functions
    const nextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIndex);
        if (isPlaying) {
            audio.play().catch(err => console.error('Auto-play failed:', err));
        }
    };
    
    const prevTrack = () => {
        const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
        loadTrack(prevIndex);
        if (isPlaying) {
            audio.play().catch(err => console.error('Auto-play failed:', err));
        }
    };

    // Create visualizer bars with optimized DOM manipulation
    const barCount = 30;
    const fragment = document.createDocumentFragment();
    const visBars = [];
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.classList.add('vis-bar');
        bar.style.height = '0%';
        fragment.appendChild(bar);
        visBars.push(bar);
    }
    visualizer.appendChild(fragment);

    // Optimized visualizer update with requestAnimationFrame, throttled to 30fps
    let lastVisUpdate = 0;
    const VIS_FPS = 30;
    const updateVisualizer = (now) => {
        if (!isPlaying || !isVisualizerVisible()) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            return;
        }
        now = now || performance.now();
        if (now - lastVisUpdate > 1000 / VIS_FPS) {
            visBars.forEach(bar => {
                bar.style.height = `${Math.random() * 100}%`;
            });
            lastVisUpdate = now;
        }
        animationFrameId = requestAnimationFrame(updateVisualizer);
    };

    // Event listeners for controls
    playBtn.addEventListener('click', async () => {
        try {
            // Ensure audio is not muted and has a source
            audio.muted = false;
            if (!audio.src) {
                alert('Audio source missing!');
                return;
            }
            await audio.play();
            isPlaying = true;
            updateVisualizer();
        } catch (err) {
            console.error('Audio play failed:', err);
            alert('Audio playback failed. See console for details.');
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        audio.pause();
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });
    
    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Reset visualizer bars
        visBars.forEach(bar => {
            bar.style.height = '0%';
        });
    });
    
    // Navigation controls
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // Throttled time update for better performance
    let timeUpdateTimeout = null;
    audio.addEventListener('timeupdate', () => {
        if (timeUpdateTimeout) return;
        
        timeUpdateTimeout = setTimeout(() => {
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeUpdateTimeout = null;
        }, 100); // Update every 100ms instead of every frame
    });

    // Handle play/pause events
    audio.addEventListener('play', () => {
        isPlaying = true;
        updateVisualizer();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });

    // Auto-advance to next track when current track ends
    audio.addEventListener('ended', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Set isPlaying to true so nextTrack will auto-play
        isPlaying = true;
        nextTrack();
    });
    
    // Initialize playlist
    await loadPlaylist();
};
