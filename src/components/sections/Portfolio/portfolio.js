const dataEl = document.getElementById("portfolio-data");
const { videos, horizontals, verticals } = JSON.parse(
  dataEl?.textContent ?? "{}",
);

/* ---- Left column: looping mp4 clips with crossfade ---- */
const videoEl = document.getElementById("video-current");
let vi = 0;
const SLIDE_MS = 4500;
const FADE_MS = 500;

// Fade in only once the first frame is decoded, so a slow load never flashes an empty tile
videoEl?.addEventListener("loadeddata", () => {
  videoEl.style.opacity = "1";
});

function playVideo(item) {
  if (!videoEl || !item) return;
  videoEl.src = item.src;
  // Autoplay may be blocked (e.g. data saver) – the tile still links to the gallery
  videoEl.play()?.catch(() => {});
}

function swapVideo() {
  if (!videoEl || videos.length === 0) return;
  videoEl.style.opacity = "0";
  window.setTimeout(() => playVideo(videos[vi]), FADE_MS);
}

/* ---- Right column: 3 photos with staggered zoom-in ---- */
const fotoV = document.getElementById("foto-v");
const fotoH1 = document.getElementById("foto-h1");
const fotoH2 = document.getElementById("foto-h2");
let hi = 0;
let vIdx = 0;

function zoom(el, delayMs) {
  if (!el) return;
  el.style.animation = "none";
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
playVideo(videos[0]);
showFoto();

/* ---- Single synced loop driving both columns ---- */
window.setInterval(() => {
  vi = (vi + 1) % Math.max(videos.length, 1);
  swapVideo();
  advanceFoto();
}, SLIDE_MS);
