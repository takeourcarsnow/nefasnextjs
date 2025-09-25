// Dynamically loads status updates from status.json and renders them in the status-log div
export function initStatusLog() {
    const statusLog = document.querySelector('.status-log');
    if (!statusLog) return;
    fetch('data/status.json')
        .then(response => response.json())
        .then(statuses => {
            statusLog.innerHTML = '';
            statuses.forEach(status => {
                const item = document.createElement('div');
                item.className = 'status-item';
                item.innerHTML = `<span class="status-time artifact-violet">[${status.date}]</span> <span class="status-msg">${status.msg}</span>`;
                statusLog.appendChild(item);
            });
        })
        .catch(err => {
            statusLog.innerHTML = '<div class="status-item">Failed to load status updates.</div>';
        });
}
