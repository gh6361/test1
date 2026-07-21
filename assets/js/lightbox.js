document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const close = document.getElementById('lightbox-close');

  if (!overlay || !image || !close) return;

  document.querySelectorAll('.lightbox-trigger').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      image.src = link.href;
      overlay.classList.remove('hidden');
    });
  });

  close.addEventListener('click', () => {
    overlay.classList.add('hidden');
    image.src = '';
  });

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      overlay.classList.add('hidden');
      image.src = '';
    }
  });
});