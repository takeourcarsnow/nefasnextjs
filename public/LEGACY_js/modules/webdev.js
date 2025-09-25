// Dynamically loads all webdev projects from webdev.json into the webdev section
window.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('webdev-projects-grid');
  if (!grid) return;
  fetch('/data/webdev.json')
    .then(res => res.json())
    .then(projects => {
      projects.sort((a, b) => new Date(b.date) - new Date(a.date));
      grid.innerHTML = projects.map(project => `
        <div class="grid-item webdev-item">
          <img src="${project.image}" alt="${project.title} website screenshot" loading="lazy" decoding="async" style="width:100%;height:100px;object-fit:cover;margin-bottom:8px;border-radius:6px;">
          <a href="${project.url}" target="_blank" rel="noopener noreferrer"><h3>> ${project.title}</h3></a>
          <p>${project.description}</p>
        </div>
      `).join('');
    })
    .catch(err => {
      grid.innerHTML = '<p style="color:red">Failed to load webdev projects.</p>';
      console.error('Failed to load webdev projects:', err);
    });
});
