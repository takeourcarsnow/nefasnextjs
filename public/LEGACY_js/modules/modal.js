export const initImageModal = () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.d3-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            const captionText = item.getAttribute('data-caption');
            modalImg.src = imgSrc;
            modalCaption.textContent = `> ${captionText}`;
            modal.style.display = 'flex';
            // Hide CRT scanlines when modal is open
            const scanlines = document.querySelector('.scanlines');
            if (scanlines) scanlines.style.display = 'none';
        });
    });
    
    const hideModal = () => {
        modal.style.display = 'none';
        // Restore CRT scanlines when modal is closed
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) scanlines.style.display = '';
    };

    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
};
