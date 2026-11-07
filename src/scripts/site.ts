import { track } from './analytics';

/* Fade content in as it scrolls into view. */
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

/* Sidebar: time on this page, and the local time. */
const session = document.querySelector('[data-session]');
const clock = document.querySelector<HTMLElement>('[data-clock]');
if (session && clock && window.matchMedia('(min-width: 1100px)').matches) {
  const pad = (value: number) => String(value).padStart(2, '0');
  const time = new Intl.DateTimeFormat('en-CA', {
    timeZone: clock.dataset.clock,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const started = Date.now();
  const tick = () => {
    const seconds = Math.floor((Date.now() - started) / 1000);
    session.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
    clock.textContent = time.format(new Date());
  };
  tick();
  window.setInterval(tick, 1000);
}

/* The line under the name. The first role is already in the page, so it starts there. */
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
      window.setTimeout(step, deleting ? 30 : 60);
    }
  };

  if (roles.length > 1) window.setTimeout(step, 2200);
}

/* Footer toggles: Website Mayhem (D) and the 8-bit theme (B). */
const root = document.documentElement;
const mayhem = document.querySelector<HTMLElement>('#mayhem');
const mayhemToggle = document.querySelector<HTMLButtonElement>('[data-mayhem-toggle]');
const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

const toggleMayhem = () => {
  if (!mayhem || !mayhemToggle) return;
  const open = mayhem.classList.toggle('is-open');
  mayhemToggle.setAttribute('aria-expanded', String(open));
  if (open) mayhem.scrollIntoView({ block: 'center' });
};

const syncTheme = () => {
  themeToggle?.setAttribute('aria-pressed', String(root.classList.contains('eight-bit')));
};

const toggleTheme = () => {
  const on = root.classList.toggle('eight-bit');
  try {
    if (on) localStorage.setItem('theme', '8-bit');
    else localStorage.removeItem('theme');
  } catch {
    /* The theme still applies to this page. */
  }
  syncTheme();
  window.dispatchEvent(new Event('sitetheme'));
  track('theme_toggle', { theme: on ? '8-bit' : 'default' });
};

syncTheme();
mayhemToggle?.addEventListener('click', toggleMayhem);
themeToggle?.addEventListener('click', toggleTheme);
window.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key.toLowerCase();
  if (key === 'd') toggleMayhem();
  if (key === 'b') toggleTheme();
});

/* Each background loads once the page is ready, so it never slows the content. */
const canvas = document.querySelector<HTMLCanvasElement>('#sky');
const whenIdle = (work: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(work, { timeout: 1200 }) : setTimeout(work, 200);

const startBackground = async () => {
  if (!canvas) return;
  const scene = canvas.dataset.scene;
  if (scene === 'constellations') {
    (await import('./sky/constellations')).startConstellations(canvas);
  } else if (scene === 'orbit') {
    (await import('./sky/orbit')).startOrbit(canvas);
  } else {
    (await import('./sky/still')).drawStill(canvas);
  }
};

const begin = () => whenIdle(() => void startBackground());
if (document.readyState === 'complete') begin();
else window.addEventListener('load', begin, { once: true });
