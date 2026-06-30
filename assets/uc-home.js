document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-uc-scroll]');
  if (!button) return;

  const section = button.closest('[data-uc-section]');
  const track = section?.querySelector('[data-uc-track]');
  if (!track) return;

  const direction = button.dataset.ucScroll === 'prev' ? -1 : 1;
  track.scrollBy({ left: direction * Math.max(260, track.clientWidth * 0.75), behavior: 'smooth' });
});
