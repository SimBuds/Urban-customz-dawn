const closeUcHeaderMenu = (header) => {
  const toggle = header.querySelector('[data-uc-menu-toggle]');
  header.classList.remove('is-menu-open');
  toggle?.setAttribute('aria-expanded', 'false');
};

document.addEventListener('click', (event) => {
  const menuToggle = event.target.closest('[data-uc-menu-toggle]');
  if (menuToggle) {
    const header = menuToggle.closest('[data-uc-mobile-header]');
    if (!header) return;

    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('is-menu-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    return;
  }

  document.querySelectorAll('[data-uc-mobile-header].is-menu-open').forEach((header) => {
    if (!header.contains(event.target)) closeUcHeaderMenu(header);
  });

  const menuLink = event.target.closest('[data-uc-mobile-header] .nav a');
  if (menuLink && window.matchMedia('(max-width: 749px)').matches) {
    closeUcHeaderMenu(menuLink.closest('[data-uc-mobile-header]'));
  }

  const button = event.target.closest('[data-uc-scroll]');
  if (!button) return;

  const section = button.closest('[data-uc-section]');
  const track = section?.querySelector('[data-uc-track]');
  if (!track) return;

  const direction = button.dataset.ucScroll === 'prev' ? -1 : 1;
  track.scrollBy({ left: direction * Math.max(260, track.clientWidth * 0.75), behavior: 'smooth' });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  document.querySelectorAll('[data-uc-mobile-header].is-menu-open').forEach(closeUcHeaderMenu);
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
