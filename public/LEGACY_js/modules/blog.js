
// Utility to format date and time since posted
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function timeSince(dateStr) {
    const now = new Date();
    const posted = new Date(dateStr);
    const seconds = Math.floor((now - posted) / 1000);
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}


export const initBlogToggles = (callback = null, targetContainer = null) => {
    const blogContainer = targetContainer || document.getElementById('blog-content');
    console.log('initBlogToggles called with container:', blogContainer);
    if (!blogContainer) return;

    // Get the stored expanded states
    const expandedPosts = new Set(JSON.parse(sessionStorage.getItem('expandedPosts') || '[]'));
    // Get the stored language, default to 'en'
    let lang = sessionStorage.getItem('blogLang') || 'en';

    // Inject custom styles for language switcher if not already present
    if (!document.getElementById('blog-lang-switcher-style')) {
        const style = document.createElement('style');
        style.id = 'blog-lang-switcher-style';
        style.textContent = `
        .blog-lang-switcher {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            justify-content: flex-end;
        }
        .blog-lang-btn {
            background: linear-gradient(90deg, #ff8ae2 0%, #8fd3ff 100%);
            color: #222;
            border: none;
            border-radius: 6px;
            padding: 4px 14px;
            font-family: inherit;
            font-size: 0.95em;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px 0 rgba(140, 0, 255, 0.10);
            cursor: pointer;
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            outline: none;
        }
        .blog-lang-btn.active, .blog-lang-btn:focus {
            background: linear-gradient(90deg, #8fd3ff 0%, #ff8ae2 100%);
            color: #fff;
            box-shadow: 0 0 0 2px #ff8ae2, 0 2px 8px 0 rgba(140, 0, 255, 0.15);
        }
        .blog-lang-btn:hover:not(.active) {
            background: linear-gradient(90deg, #ffb6ff 0%, #b6eaff 100%);
            color: #333;
        }
        `;
        document.head.appendChild(style);
    }

    // Helper to render language switcher for a post
    function renderLangSwitcher(postTitle) {
        return `<div class="blog-lang-switcher">
            <button data-lang="en" data-title="${postTitle}" class="blog-lang-btn${lang === 'en' ? ' active' : ''}">English</button>
            <button data-lang="lt" data-title="${postTitle}" class="blog-lang-btn${lang === 'lt' ? ' active' : ''}">Lietuviškai</button>
        </div>`;
    }

    fetch('/data/posts.json')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(posts => {

            // Render all posts (accordion style, but do not re-render on language switch)
            posts.forEach(post => {
                const tags = post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join(' ');
                const isExpanded = expandedPosts.has(post.title);
                const contentArr = (post.content && post.content[lang]) ? post.content[lang] : (post.content.en || []);
                const snippet = document.createElement('div');
                snippet.className = 'blog-snippet';
                snippet.innerHTML = `
                    <div class="blog-snippet-header">
                        <h3>> ${post.title}</h3>
                        <span class="blog-date">${formatDate(post.date)} (${timeSince(post.date)})</span>
                        <span class="blog-tags">${tags}</span>
                        <span class="blog-toggle">${isExpanded ? '[ ...read less ]' : '[ read more... ]'}</span>
                    </div>
                    <div class="blog-full-content${isExpanded ? ' expanded' : ''}">
                        ${isExpanded ? renderLangSwitcher(post.title) : ''}
                        <div class="blog-content-text">
                            ${contentArr.map(p => `<p>${p}</p>`).join('')}
                        </div>
                    </div>
                `;
                blogContainer.appendChild(snippet);
            });

            // Add toggles
            blogContainer.querySelectorAll('.blog-snippet-header').forEach(header => {
                header.addEventListener('click', () => {
                    const fullContent = header.nextElementSibling;
                    const toggleText = header.querySelector('.blog-toggle');
                    const postTitle = header.querySelector('h3').textContent.slice(2);
                    const isExpanded = fullContent.classList.contains('expanded');

                    if (!isExpanded) {
                        fullContent.classList.remove('expanded');
                        void fullContent.offsetWidth;
                        fullContent.classList.add('expanded');
                        toggleText.textContent = '[ ...read less ]';
                        expandedPosts.add(postTitle);
                        // Insert language switcher if not present
                        if (!fullContent.querySelector('.blog-lang-switcher')) {
                            const switcher = document.createElement('div');
                            switcher.innerHTML = renderLangSwitcher(postTitle);
                            fullContent.insertBefore(switcher.firstChild, fullContent.firstChild);
                        }
                    } else {
                        fullContent.classList.remove('expanded');
                        toggleText.textContent = '[ read more... ]';
                        expandedPosts.delete(postTitle);
                    }
                    sessionStorage.setItem('expandedPosts', JSON.stringify([...expandedPosts]));
                });
            });

            // Add language switcher events (delegated)
            blogContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('blog-lang-btn')) {
                    const newLang = e.target.getAttribute('data-lang');
                    const postTitle = e.target.getAttribute('data-title');
                    if (newLang !== lang) {
                        lang = newLang;
                        sessionStorage.setItem('blogLang', lang);
                    }
                    // Find the post and update only its content
                    const post = posts.find(p => p.title === postTitle);
                    if (post) {
                        const contentArr = (post.content && post.content[lang]) ? post.content[lang] : (post.content.en || []);
                        const snippet = Array.from(blogContainer.querySelectorAll('.blog-snippet')).find(sn => sn.querySelector('h3').textContent.slice(2) === postTitle);
                        if (snippet) {
                            // Update language switcher active state
                            snippet.querySelectorAll('.blog-lang-btn').forEach(btn => {
                                btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
                            });
                            // Update content text
                            const contentDiv = snippet.querySelector('.blog-content-text');
                            if (contentDiv) {
                                contentDiv.innerHTML = contentArr.map(p => `<p>${p}</p>`).join('');
                            }
                        }
                    }
                }
            });

            // Call callback if provided
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            const errorMessage = `<p style="color: #ff0000;">Error loading blog posts: ${error.message}</p>`;

            // Check if blog container already has terminal content
            const existingTerminal = blogContainer.querySelector('#blog-terminal-output');
            if (existingTerminal) {
                const errorDiv = document.createElement('div');
                errorDiv.innerHTML = errorMessage;
                errorDiv.style.marginTop = '20px';
                blogContainer.appendChild(errorDiv);
            } else {
                blogContainer.innerHTML = errorMessage;
            }

            if (callback) {
                callback();
            }
        });
};
