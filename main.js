const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const mobileLayout = window.matchMedia('(max-width: 920px)');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', opening);
    document.body.classList.toggle('menu-open', opening);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu({ restoreFocus: true });
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  mobileLayout.addEventListener('change', () => closeMenu());
}

if (header) {
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 35);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

if ('IntersectionObserver' in window && nav) {
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting);
    if (!visible) return;
    navLinks.forEach(link => {
      if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  navLinks.forEach(link => {
    const target = document.querySelector(link.hash);
    if (target) sectionObserver.observe(target);
  });
  document.querySelectorAll('.hero, #news').forEach(section => sectionObserver.observe(section));
}
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
