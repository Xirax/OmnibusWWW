function initVideoOverlay() {
  const overlay = document.getElementById("video-overlay");
  if (
    !(overlay instanceof HTMLDialogElement) ||
    overlay.dataset.bound === "true"
  )
    return;
  overlay.dataset.bound = "true";

  const frame = overlay.querySelector(".video-overlay__frame");
  const backdrop = overlay.querySelector(".video-overlay__backdrop");

  /** @param {HTMLElement} card */
  const open = (card) => {
    const iframe = document.createElement("iframe");
    iframe.src = card.dataset.videoEmbed ?? "";
    iframe.title = card.dataset.videoTitle || "Omnibus Media Studio — wideo";
    iframe.className = "w-full h-full";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    frame?.replaceChildren(iframe);
    overlay.dataset.orientation = card.dataset.videoOrientation ?? "horizontal";
    overlay.showModal();
    document.body.style.overflow = "hidden";
  };

  // Fires for Esc as well as the close button / backdrop click.
  overlay.addEventListener("close", () => {
    frame?.replaceChildren();
    document.body.style.overflow = "";
  });

  overlay
    .querySelector(".video-overlay__close")
    ?.addEventListener("click", () => overlay.close());
  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) overlay.close();
  });

  document.addEventListener("click", (e) => {
    const card =
      e.target instanceof Element
        ? e.target.closest("[data-video-embed]")
        : null;
    if (card instanceof HTMLElement) open(card);
  });
}

initVideoOverlay();
document.addEventListener("astro:page-load", initVideoOverlay);
