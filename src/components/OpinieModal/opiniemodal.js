function initOpinieModal() {
  const modal = document.getElementById('opinie-modal');
  if (!modal || modal.dataset.bound === 'true') return;
  modal.dataset.bound = 'true';

  const closeBtn = modal.querySelector('.opinie-modal__close');
  const triggers = document.querySelectorAll('[data-opinie-modal-open]');

  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

initOpinieModal();
document.addEventListener('astro:page-load', initOpinieModal);
