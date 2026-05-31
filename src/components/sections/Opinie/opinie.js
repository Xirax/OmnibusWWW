function animateCounter(el) {
  const target = parseInt(el.dataset.target ?? '0', 10);
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = '+' + Math.floor(eased * target).toString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = '+' + target.toString();
  }

  requestAnimationFrame(tick);
}

// Trigger when section scrolls into view
const counters = document.querySelectorAll('[data-counter]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

counters.forEach(el => observer.observe(el));
