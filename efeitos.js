(() => {
  const elements = document.querySelectorAll('.hero-copy, .hero-media, .section-head, .services-intro, .services-grid article, .about-grid, .steps article, .reviews-head, .reviews-grid article, .bio-welcome, .bio-media, .bio-banner, .location>.container>.eyebrow, .location>.container>h2, .location>.container>p, .unit-card, .faq-grid>div:first-child, .faq details');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }
  document.documentElement.classList.add('reveal-ready');
  elements.forEach((el, index) => {
    el.classList.add('reveal-item');
    const directions = ['reveal-from-bottom', 'reveal-from-left', 'reveal-from-top', 'reveal-from-right'];
    const serviceIndex = [...document.querySelectorAll('.services-grid article')].indexOf(el);
    el.classList.add(serviceIndex >= 0 ? (serviceIndex % 2 ? 'reveal-from-right' : 'reveal-from-left') : directions[index % directions.length]);
    el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, {threshold: .12, rootMargin: '0px 0px -7% 0px'});
  elements.forEach(el => observer.observe(el));
})();
