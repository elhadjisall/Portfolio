import { track } from './analytics';

/* Theme toggle. The saved choice is applied before paint in Base.astro. */
const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

// Dark is the default. Light only applies when a visitor chooses it.
const currentTheme = () => root.dataset.theme ?? 'dark';

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
syncToggle();

/* Hero typing line. The first role is already in the page, so it starts there. */
const typed = document.querySelector<HTMLElement>('[data-typed]');
if (typed && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const roles = JSON.parse(typed.dataset.typed ?? '[]') as string[];
  let role = 0;
  let length = roles[0]?.length ?? 0;
  let deleting = true;

  const step = () => {
    const text = roles[role];
    length += deleting ? -1 : 1;
    typed.textContent = text.slice(0, length);

    if (deleting && length === 0) {
      deleting = false;
      role = (role + 1) % roles.length;
      window.setTimeout(step, 350);
    } else if (!deleting && length === text.length) {
      deleting = true;
      window.setTimeout(step, 2200);
    } else {
      window.setTimeout(step, deleting ? 28 : 55);
    }
  };

  if (roles.length > 1) window.setTimeout(step, 2200);
}

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
