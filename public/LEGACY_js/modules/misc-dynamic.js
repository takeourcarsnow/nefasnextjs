// Dynamically loads and renders digital artifacts and interesting links in the misc section
export function initMiscDynamic() {
    // Artifacts
    const artifactsList = document.querySelector('.artifacts-list');
    if (artifactsList) {
        fetch('data/artifacts.json')
            .then(res => res.json())
            .then(artifacts => {
                artifactsList.innerHTML = '';
                artifacts.forEach(a => {
                    const div = document.createElement('div');
                    div.className = 'artifact-item';
                    if (a.path) {
                        div.innerHTML = `<a href="/${a.path}" target="_blank" class="artifact-link"><span class="artifact-name">${a.name}</span></a> <span class="artifact-desc">${a.desc}</span>`;
                    } else {
                        div.innerHTML = `<span class="artifact-name">${a.name}</span> <span class="artifact-desc">${a.desc}</span>`;
                    }
                    artifactsList.appendChild(div);
                });
            })
            .catch(() => {
                artifactsList.innerHTML = '<div class="artifact-item">Failed to load artifacts.</div>';
            });
    }

    // Links
    const linksContainer = document.querySelector('.links-container');
    if (linksContainer) {
        fetch('data/links.json')
            .then(res => res.json())
            .then(links => {
                linksContainer.innerHTML = '';
                links.forEach(link => {
                    const div = document.createElement('div');
                    div.className = 'artifact-item';
                    div.innerHTML = `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="artifact-link"><span class="artifact-name">${link.title}</span></a> <span class="artifact-desc">${link.desc}</span>`;
                    linksContainer.appendChild(div);
                });
            })
            .catch(() => {
                linksContainer.innerHTML = '<div class="link-item">Failed to load links.</div>';
            });
    }

    // Misc Thoughts
    const thoughtsContainer = document.querySelector('.misc-thoughts');
    if (thoughtsContainer) {
        fetch('data/thoughts.json')
            .then(res => res.json())
            .then(thoughts => {
                thoughtsContainer.innerHTML = '';
                thoughts.forEach(thought => {
                    const p = document.createElement('p');
                    p.textContent = thought;
                    thoughtsContainer.appendChild(p);
                });
            })
            .catch(() => {
                thoughtsContainer.innerHTML = '<p>Failed to load thoughts.</p>';
            });
    }
}

// Live footer timestamp
export function initFooterTimestamp() {
    const ts = document.getElementById('footer-timestamp');
    if (!ts) return;
    function update() {
        const now = new Date();
        // Format: [YYYY.MM.DD HH:MM:SS]
        const pad = n => n.toString().padStart(2, '0');
        const str = `[${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
        ts.textContent = str;
    }
    update();
    setInterval(update, 1000);
}
