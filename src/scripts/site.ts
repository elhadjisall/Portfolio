import { track } from './analytics';

/* Theme toggle. The saved choice is applied before paint in Base.astro. */
const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const currentTheme = () => root.dataset.theme ?? (systemDark.matches ? 'dark' : 'light');

function syncToggle() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  toggles.forEach((button) => button.setAttribute('aria-label', `Switch to ${next} theme`));
}

toggles.forEach((button) =>
  button.addEventListener('click', () => {
    const theme = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* The toggle still works for this page view. */
    }
    syncToggle();
    track('theme_toggle', { theme });
  }),
);
systemDark.addEventListener('change', syncToggle);
syncToggle();

/* Fade and slide content in as it scrolls into view. */
const revealed = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  revealed.forEach((el) => observer.observe(el));
} else {
  revealed.forEach((el) => el.classList.add('is-in'));
}

/* Highlight the section being read in the navigation. */
const navLinks = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>('[data-nav-link]').forEach((link) => {
  navLinks.set(link.dataset.navLink ?? '', link);
});
const tracked = [...document.querySelectorAll<HTMLElement>('[data-section]')].filter((section) =>
  navLinks.has(section.dataset.section ?? ''),
);

if (tracked.length > 0 && 'IntersectionObserver' in window) {
  const navScroller = document.querySelector<HTMLElement>('[data-nav-scroller]');
  const hero = document.querySelector('#top');
  const footer = document.querySelector('footer');
  const last = tracked[tracked.length - 1].dataset.section ?? '';
  let reading = '';
  let atFooter = false;

  const paint = () => {
    const active = atFooter ? last : reading;
    navLinks.forEach((link, section) => {
      if (section === active) {
        link.setAttribute('aria-current', 'true');
        // Keep the active link visible in the scrolling mobile bar.
        if (navScroller && navScroller.scrollWidth > navScroller.clientWidth) {
          navScroller.scrollTo({ left: link.offsetLeft - 16 });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // The band across the middle of the screen decides what is being read.
  const bandObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const section = (entry.target as HTMLElement).dataset.section ?? '';
        if (entry.isIntersecting) reading = section;
        else if (reading === section) reading = '';
      }
      paint();
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  [hero, ...tracked].forEach((el) => el && bandObserver.observe(el));

  // The last section may be too short to ever reach the middle of the screen,
  // so a footer that is almost fully visible (the end of the page) selects it.
  if (footer) {
    new IntersectionObserver(
      ([entry]) => {
        atFooter = entry.isIntersecting;
        paint();
      },
      { threshold: 0.9 },
    ).observe(footer);
  }
}
