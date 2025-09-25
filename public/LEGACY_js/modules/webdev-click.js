// Makes the entire .webdev-item clickable to its link
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.webdev-item').forEach(function(item) {
    const link = item.querySelector('a[href]');
    if (link) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function(e) {
        // Prevent double navigation if the user clicks the link directly
        if (!e.target.closest('a')) {
          window.open(link.href, link.target || '_self');
        }
      });
    }
  });
});
