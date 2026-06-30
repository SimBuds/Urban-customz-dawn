document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-uc-scroll]');
  if (!button) return;

  const section = button.closest('[data-uc-section]');
  const track = section?.querySelector('[data-uc-track]');
  if (!track) return;

  const direction = button.dataset.ucScroll === 'prev' ? -1 : 1;
  track.scrollBy({ left: direction * Math.max(260, track.clientWidth * 0.75), behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-uc-autoscroll]').forEach((track) => {
    let paused = false;

    const setPaused = (value) => {
      paused = value;
    };

    track.addEventListener('mouseenter', () => setPaused(true));
    track.addEventListener('mouseleave', () => setPaused(false));
    track.addEventListener('focusin', () => setPaused(true));
    track.addEventListener('focusout', () => setPaused(false));

    window.setInterval(() => {
      if (paused || track.scrollWidth <= track.clientWidth) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      const nextLeft = track.scrollLeft + Math.max(240, track.clientWidth * 0.55);

      if (nextLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      track.scrollTo({ left: nextLeft, behavior: 'smooth' });
    }, 3200);
  });
});
