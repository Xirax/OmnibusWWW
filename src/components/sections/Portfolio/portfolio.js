const dataEl = document.getElementById('portfolio-data');
const { videos, horizontals, verticals } = JSON.parse(dataEl?.textContent ?? '{}');

/* ---- Left column: looping gifs with crossfade ---- */
const videoEl = document.getElementById('video-current');
let vi = 0;
const SLIDE_MS = 4500;
const FADE_MS = 500;

function swapVideo() {
  if (!videoEl || videos.length === 0) return;
  const next = videos[vi];
  videoEl.style.opacity = '0';
  const apply = () => {
    videoEl.src = next.src;
    videoEl.alt = next.id;
    requestAnimationFrame(() => { videoEl.style.opacity = '1'; });
  };
  if (videoEl.src) window.setTimeout(apply, FADE_MS);
  else apply();
}

/* ---- Right column: 3 photos with staggered zoom-in ---- */
const fotoV  = document.getElementById('foto-v');
const fotoH1 = document.getElementById('foto-h1');
const fotoH2 = document.getElementById('foto-h2');
let hi = 0;
let vIdx = 0;

function zoom(el, delayMs) {
  if (!el) return;
  el.style.animation = 'none';
  void el.offsetWidth; // force reflow to restart animation
  el.style.animation = `portfolioZoom 700ms ease-out ${delayMs}ms both`;
}

function setImg(el, item) {
  if (!el || !item) return;
  el.src = item.src;
  el.alt = item.id;
}

function showFoto() {
  if (verticals.length) setImg(fotoV, verticals[vIdx % verticals.length]);
  if (horizontals.length) {
    setImg(fotoH1, horizontals[hi % horizontals.length]);
    setImg(fotoH2, horizontals[(hi + 1) % horizontals.length]);
  }
  zoom(fotoV, 0);
  zoom(fotoH1, 140);
  zoom(fotoH2, 280);
}

function advanceFoto() {
  hi = (hi + 2) % Math.max(horizontals.length, 1);
  vIdx = (vIdx + 1) % Math.max(verticals.length, 1);
  showFoto();
}

/* ---- Initial render ---- */
if (videos.length) { videoEl.src = videos[0].src; videoEl.alt = videos[0].id; videoEl.style.opacity = '1'; }
showFoto();

/* ---- Single synced loop driving both columns ---- */
window.setInterval(() => {
  vi = (vi + 1) % Math.max(videos.length, 1);
  swapVideo();
  advanceFoto();
}, SLIDE_MS);
