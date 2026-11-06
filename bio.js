(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactMotion = matchMedia('(max-width: 560px)').matches;
  const root = document.documentElement;
  const progress = document.createElement('span');
  progress.className = 'bio-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const items = [
    document.querySelector('.bio-header'),
    document.querySelector('.bio-media'),
    document.querySelector('.quick-note'),
    document.querySelector('.scroll-cue'),
    ...document.querySelectorAll('.bio-link'),
    document.querySelector('.bio-footer')
  ].filter(Boolean);

  items.forEach((item, index) => {
    item.classList.add('bio-reveal');
    item.style.setProperty('--bio-delay', `${Math.min(index * 55, 220)}ms`);
    if (item.matches('.bio-link:nth-child(even)')) item.classList.add('from-right');
  });

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    root.classList.add('motion-reduced');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px 48px' });
  items.forEach(item => observer.observe(item));

  let ticking = false;
  const updateMotion = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    const media = compactMotion ? null : document.querySelector('.bio-media img');
    const rect = document.querySelector('.bio-media')?.getBoundingClientRect();
    if (media && rect) {
      const offset = Math.max(-12, Math.min(12, (innerHeight * .5 - (rect.top + rect.height * .5)) * .025));
      media.style.setProperty('--bio-parallax', `${offset}px`);
    }
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateMotion);
      ticking = true;
    }
  }, { passive: true });
  updateMotion();
})();

(() => {
  const video = document.querySelector('#bio-video');
  const cover = document.querySelector('#bio-cover');
  const controls = document.querySelector('.bio-video-controls');
  const sound = document.querySelector('#bio-sound');
  const shell = document.querySelector('.bio-media');
  const src = video?.getAttribute('src');
  let userActivatedSound = false;
  let audiblePlaysRemaining = 0;
  if (!video || !src) return;
  video.defaultMuted = true;

  const showMutedControl = () => {
    audiblePlaysRemaining = 0;
    video.muted = true;
    shell?.classList.remove('is-unmuted');
    sound.innerHTML = "<span class=\"sound-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"m11 4-6 5H2v6h3l6 5zM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14\"/></svg></span><span><strong>Ativar som</strong><small>O vídeo reinicia ao tocar</small></span>";
    sound.setAttribute('aria-pressed', 'false');
    sound.setAttribute('aria-label', 'Ativar o som e iniciar o vídeo desde o começo');
  };

  const showSoundOnControl = () => {
    video.muted = false;
    shell?.classList.add('is-unmuted');
    sound.innerHTML = "<span class=\"sound-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"m11 4-6 5H2v6h3l6 5zM16 9l6 6M16 15l6-6\"/></svg></span><span><strong>Silenciar</strong></span>";
    sound.setAttribute('aria-pressed', 'true');
    sound.setAttribute('aria-label', 'Silenciar vídeo');
  };

  const fallback = () => { video.hidden = true; cover.hidden = false; controls.hidden = true; shell?.classList.remove('has-video','is-unmuted'); };
  video.addEventListener('error', fallback);
  video.addEventListener('loadeddata', () => {
    showMutedControl();
    shell?.classList.add('has-video');
    cover.hidden = true;
    video.hidden = false;
    controls.hidden = false;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {});
    } else { video.pause(); }
  });
  sound.addEventListener('click', () => {
    if (video.muted) {
      userActivatedSound = true;
      video.currentTime = 0;
      audiblePlaysRemaining = 2;
      showSoundOnControl();
      video.play().catch(() => {});
    } else {
      showMutedControl();
    }
  });

  video.addEventListener('ended', () => {
    if (!video.muted && audiblePlaysRemaining > 0) {
      audiblePlaysRemaining -= 1;
    }

    if (!video.muted && audiblePlaysRemaining === 0) {
      showMutedControl();
    }

    video.currentTime = 0;
    video.play().catch(() => {});
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (userActivatedSound || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {});
  });
  video.src = src;
})();
