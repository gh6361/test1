document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lightbox');
  const stage = document.getElementById('lightbox-stage');
  const imageA = document.getElementById('lightbox-image-a');
  const imageB = document.getElementById('lightbox-image-b');
  const close = document.getElementById('lightbox-close');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');
  const leftZone = document.getElementById('lightbox-left-zone');
  const rightZone = document.getElementById('lightbox-right-zone');
  const caption = document.getElementById('lightbox-caption');

  if (
    !overlay || !stage || !imageA || !imageB || !close ||
    !prev || !next || !leftZone || !rightZone || !caption
  ) return;

  const triggers = [...document.querySelectorAll('.lightbox-trigger')];
  if (!triggers.length) return;

  const gallery = triggers.map((link) => ({
    href: link.href,
    caption: link.dataset.caption || ''
  }));

  let currentIndex = 0;
  let activeImage = imageA;
  let inactiveImage = imageB;
  let uiTimer = null;

  const UI_HIDE_DELAY = 1800;

  function swapImages() {
    [activeImage, inactiveImage] = [inactiveImage, activeImage];
  }

  function showUi() {
    overlay.classList.add('show-ui');
    clearTimeout(uiTimer);

    uiTimer = window.setTimeout(() => {
      if (!overlay.classList.contains('hidden') && overlay.classList.contains('fullscreen')) {
        overlay.classList.remove('show-ui');
      }
    }, UI_HIDE_DELAY);
  }

  function hideUi() {
    overlay.classList.remove('show-ui');
    clearTimeout(uiTimer);
  }

  function renderImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    const item = gallery[currentIndex];

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

  function openLightbox(index) {
    overlay.classList.remove('fullscreen');
    hideUi();
    renderImage(index);
  }

  function closeLightbox() {
    overlay.classList.add('hidden');
    overlay.classList.remove('fullscreen', 'show-ui');
    hideUi();

    imageA.src = '';
    imageB.src = '';
    imageA.alt = '';
    imageB.alt = '';
    caption.textContent = '';

    imageA.classList.add('active');
    imageB.classList.remove('active');
    activeImage = imageA;
    inactiveImage = imageB;
  }

  function nextImage() {
    renderImage(currentIndex + 1);
    if (overlay.classList.contains('fullscreen')) showUi();
  }

  function previousImage() {
    renderImage(currentIndex - 1);
    if (overlay.classList.contains('fullscreen')) showUi();
  }

  function toggleFullscreen() {
    if (overlay.classList.contains('fullscreen')) {
      overlay.classList.remove('fullscreen');
      hideUi();
    } else {
      overlay.classList.add('fullscreen');
      showUi();
    }
  }

  triggers.forEach((link, index) => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openLightbox(index);
    });
  });

  stage.addEventListener('click', () => {
    if (overlay.classList.contains('hidden')) return;
    toggleFullscreen();
  });

  overlay.addEventListener('mousemove', () => {
    if (overlay.classList.contains('fullscreen') && !overlay.classList.contains('hidden')) {
      showUi();
    }
  });

  leftZone.addEventListener('click', event => {
    event.stopPropagation();
    previousImage();
  });

  rightZone.addEventListener('click', event => {
    event.stopPropagation();
    nextImage();
  });

  prev.addEventListener('click', event => {
    event.stopPropagation();
    previousImage();
  });

  next.addEventListener('click', event => {
    event.stopPropagation();
    nextImage();
  });

  close.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', event => {
    if (overlay.classList.contains('hidden')) return;

    if (event.key === 'ArrowLeft') previousImage();
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'Escape') closeLightbox();
  });
});