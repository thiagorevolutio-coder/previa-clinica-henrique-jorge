(() => {
  const video = document.querySelector('#bio-video');
  const cover = document.querySelector('#bio-cover');
  const controls = document.querySelector('.bio-video-controls');
  const sound = document.querySelector('#bio-sound');
  const shell = document.querySelector('.bio-media');
  const src = window.CLINICA_BIO?.videoSrc;
  let audiblePlaysRemaining = 0;
  if (!video || !src) return;
  video.defaultMuted = true;

  const showMutedControl = () => {
    audiblePlaysRemaining = 0;
    video.muted = true;
    shell?.classList.remove('is-unmuted');
    sound.innerHTML = '<span class="sound-icon" aria-hidden="true">🔊</span><strong>Ativar som</strong><small>O vídeo reinicia ao tocar</small>';
    sound.setAttribute('aria-label', 'Ativar o som e iniciar o vídeo desde o começo');
  };

  const showSoundOnControl = () => {
    video.muted = false;
    shell?.classList.add('is-unmuted');
    sound.innerHTML = '<span class="sound-icon" aria-hidden="true">🔇</span><strong>Silenciar</strong>';
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
    else video.play().catch(() => {});
  });
  video.src = src;
})();
