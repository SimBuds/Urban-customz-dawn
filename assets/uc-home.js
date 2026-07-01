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
  document.querySelectorAll('[data-uc-dots]').forEach((dots) => {
    const section = dots.closest('[data-uc-section]');
    const track = section?.querySelector('[data-uc-track]');
    const buttons = Array.from(dots.querySelectorAll('[data-uc-dot]'));
    if (!track || !buttons.length) return;

    const setActive = (index) => {
      buttons.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };

    // Per-card horizontal step (card width + gap), measured from the real DOM.
    const cardStep = () => {
      const cards = track.querySelectorAll('.card-wrap');
      if (cards.length > 1) return cards[1].offsetLeft - cards[0].offsetLeft;
      return cards[0]?.getBoundingClientRect().width || 1;
    };

    track.addEventListener('scroll', () => {
      const index = Math.round(track.scrollLeft / cardStep()) % buttons.length;
      setActive(index < 0 ? 0 : index);
    });

    buttons.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const card = track.querySelectorAll('.card-wrap')[i];
        if (card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      });
    });
  });

  // Before/after wall-art reveal — drag the centre handle to wipe between images.
  document.querySelectorAll('[data-uc-art]').forEach((reveal) => {
    const handle = reveal.querySelector('[data-uc-art-handle]');
    if (!handle) return;

    const clamp = (n) => Math.max(0, Math.min(100, n));

    const apply = (pct) => {
      const value = clamp(pct);
      reveal.style.setProperty('--uc-pos', value + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(value)));
    };

    const applyFromX = (clientX) => {
      const rect = reveal.getBoundingClientRect();
      if (!rect.width) return;
      apply(((clientX - rect.left) / rect.width) * 100);
    };

    let dragging = false;

    reveal.addEventListener('pointerdown', (event) => {
      dragging = true;
      reveal.classList.add('is-dragging');
      reveal.style.animation = 'none'; // cancel the intro hint on first interaction
      reveal.setPointerCapture?.(event.pointerId);
      if (event.pointerType === 'mouse') applyFromX(event.clientX);
    });

    reveal.addEventListener('pointermove', (event) => {
      if (dragging) applyFromX(event.clientX);
    });

    const stop = (event) => {
      if (!dragging) return;
      dragging = false;
      reveal.classList.remove('is-dragging');
      reveal.releasePointerCapture?.(event.pointerId);
    };
    reveal.addEventListener('pointerup', stop);
    reveal.addEventListener('pointercancel', stop);

    handle.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const step = (event.shiftKey ? 10 : 2) * (event.key === 'ArrowLeft' ? -1 : 1);
      reveal.style.animation = 'none';
      apply((Number(handle.getAttribute('aria-valuenow')) || 50) + step);
      event.preventDefault();
    });
  });

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
