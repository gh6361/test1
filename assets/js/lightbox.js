document.addEventListener('DOMContentLoaded', () => {

    const overlay = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');

    const close = document.getElementById('lightbox-close');
    const prev = document.getElementById('lightbox-prev');
    const next = document.getElementById('lightbox-next');

    if (!overlay || !image || !close) return;

    const gallery = [...document.querySelectorAll('.lightbox-trigger')];

    let currentIndex = 0;

    function showImage(index) {

        currentIndex = index;

        image.src = gallery[currentIndex].href;

        overlay.classList.remove('hidden');

    }

    function closeLightbox() {

        overlay.classList.add('hidden');
        image.src = '';

    }

    function nextImage() {

        currentIndex++;

        if (currentIndex >= gallery.length) {
            currentIndex = 0;
        }

        showImage(currentIndex);

    }

    function previousImage() {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = gallery.length - 1;
        }

        showImage(currentIndex);

    }

    gallery.forEach((link, index) => {

        link.addEventListener('click', event => {

            event.preventDefault();

            showImage(index);

        });

    });

    next.addEventListener('click', event => {

        event.stopPropagation();

        nextImage();

    });

    prev.addEventListener('click', event => {

        event.stopPropagation();

        previousImage();

    });

    close.addEventListener('click', closeLightbox);

    overlay.addEventListener('click', event => {

        if (event.target === overlay) {
            closeLightbox();
        }

    });

    document.addEventListener('keydown', event => {

        if (overlay.classList.contains('hidden')) return;

        switch (event.key) {

            case 'ArrowRight':
                nextImage();
                break;

            case 'ArrowLeft':
                previousImage();
                break;

            case 'Escape':
                closeLightbox();
                break;

        }

    });

});