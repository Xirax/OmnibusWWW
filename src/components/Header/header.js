const toggle = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('menu-close');
const menu = document.getElementById('mobile-menu');

function openMenu() {
  menu.classList.remove('translate-x-full');
  menu.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menu.classList.add('translate-x-full');
  menu.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.classList.remove('is-open');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  toggle.classList.contains('is-open') ? closeMenu() : openMenu();
});
closeBtn.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

const header = document.getElementById('header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();