document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lightbox');
  const stage = document.getElementById('lightbox-stage');
  const imageA = document.getElementById('lightbox-image-a');
  const imageB = document.getElementById('lightbox-image-b');
  const close = document.getElementById('lightbox-close');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');
  const counter = document.getElementById('lightbox-counter');
  const caption = document.getElementById('lightbox-caption');

  if (!overlay || !stage || !imageA || !imageB || !close || !prev || !next || !counter || !caption) return;

  const triggers = [...document.querySelectorAll('.lightbox-trigger')];
  if (!triggers.length) return;

  const gallery = triggers.map((link) => ({
    href: link.href,
    caption: link.dataset.caption || ''
  }));

  let currentIndex = 0;
  let activeImage = imageA;
  let inactiveImage = imageB;

  function swapImages() {
    [activeImage, inactiveImage] = [inactiveImage, activeImage];
  }

  function closeLightbox() {
    overlay.classList.add('hidden');
    stage.classList.remove('fullscreen');
    imageA.src = '';
    imageB.src = '';
    counter.textContent = '';
    caption.textContent = '';
  }

  function toggleFullscreen() {
    overlay.classList.toggle('fullscreen');
  }

  function showImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    const item = gallery[currentIndex];

    counter.textContent = `${currentIndex + 1} / ${gallery.length}`;
    caption.textContent = item.caption;

    inactiveImage.src = item.href;
    inactiveImage.alt = item.caption || `Gallery image ${currentIndex + 1}`;

    overlay.classList.remove('hidden');

    requestAnimationFrame(() => {
      activeImage.classList.remove('active');
      inactiveImage.classList.add('active');
      swapImages();
    });
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function previousImage() {
    showImage(currentIndex - 1);
  }

  triggers.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showImage(index);
    });
  });

  stage.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    toggleFullscreen();
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

    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'ArrowLeft') previousImage();
    if (event.key === 'Escape') closeLightbox();
  });
});