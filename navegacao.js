(() => {
  // Mantém links diretos alinhados enquanto fontes e imagens alteram a altura da página.
  let currentHash = location.hash;
  let interacted = false;
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(event => {
    window.addEventListener(event, () => { interacted = true; }, {passive:true});
  });
  async function alignSection() {
    const expectedHash = currentHash;
    if (document.fonts) await document.fonts.ready;
    if (interacted || location.hash !== expectedHash || !expectedHash) return;
    const section = document.getElementById(decodeURIComponent(expectedHash.slice(1)));
    if (section) section.scrollIntoView({behavior:'instant',block:'start'});
  }
  function stabilizeHash() {
    interacted = false;
    currentHash = location.hash;
    alignSection();
    [250, 700, 1400].forEach(delay => window.setTimeout(alignSection, delay));
  }
  window.addEventListener('hashchange', stabilizeHash);
  if (document.readyState === 'complete') stabilizeHash();
  else window.addEventListener('load', stabilizeHash, {once:true});
})();
