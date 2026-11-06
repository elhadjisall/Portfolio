/**
 * The one analytics entry point. track() sends an event to Umami and GA4 and
 * does nothing if either is blocked, unconfigured or running on localhost.
 */

type Props = Record<string, string>;

declare global {
  interface Window {
    umami?: { track: (name: string, props?: Props) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
const UTM_STORAGE_KEY = 'utm';

/** Read UTM params on arrival and keep them for the rest of the visit. */
function loadUtm(): Props {
  const fromUrl: Props = {};
  const params = new URLSearchParams(location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }
  try {
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) ?? '{}') as Props;
  } catch {
    return fromUrl;
  }
}

const utm = loadUtm();

/**
 * Umami loads after this module, so early events (the first section_view)
 * would otherwise be lost. Hold them until its script settles.
 */
const umamiScript = document.getElementById('umami-script');
let umamiQueue: Array<[string, Props]> | null = umamiScript && !window.umami ? [] : null;

if (umamiQueue) {
  umamiScript?.addEventListener('load', () => {
    const pending = umamiQueue ?? [];
    umamiQueue = null;
    for (const [name, props] of pending) sendToUmami(name, props);
  });
  umamiScript?.addEventListener('error', () => {
    umamiQueue = null;
  });
}

function sendToUmami(name: string, props: Props) {
  try {
    window.umami?.track(name, props);
  } catch {
    /* A blocked or broken tracker must never affect the page. */
  }
}

function sendToGa(name: string, props: Props) {
  try {
    window.gtag?.('event', name, props);
  } catch {
    /* As above. */
  }
}

export function track(name: string, props: Props = {}, options: { umami?: boolean } = {}) {
  const payload = { ...props, ...utm };
  if (import.meta.env.DEV) console.debug('[track]', name, payload);

  if (options.umami !== false) {
    if (umamiQueue) umamiQueue.push([name, payload]);
    else sendToUmami(name, payload);
  }
  sendToGa(name, payload);
}

const UMAMI_ATTR = /^data-umami-event-(.+)$/;

function attributeProps(el: Element): Props {
  const props: Props = {};
  for (const attr of el.getAttributeNames()) {
    const key = UMAMI_ATTR.exec(attr)?.[1];
    if (key) props[key] = el.getAttribute(attr) ?? '';
  }
  return props;
}

/**
 * Key links carry data-umami-event attributes, which Umami counts by itself.
 * This listener forwards those clicks to GA4 only, so Umami never counts one
 * click twice. Every other external link is reported as outbound_link.
 */
document.addEventListener(
  'click',
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const tagged = target.closest('[data-umami-event]');
    const name = tagged?.getAttribute('data-umami-event');
    if (tagged && name) track(name, attributeProps(tagged), { umami: false });

    const link = target.closest('a');
    if (link && /^https?:$/.test(link.protocol) && link.host !== location.host) {
      track('outbound_link', { url: link.href });
    }
  },
  { capture: true },
);

/** section_view: once per page load, the first time a section enters view. */
const sections = document.querySelectorAll<HTMLElement>('[data-section]');
if (sections.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        track('section_view', { section: (entry.target as HTMLElement).dataset.section ?? '' });
      }
    },
    // A section counts once it reaches the upper four-fifths of the screen.
    { rootMargin: '0px 0px -20% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}
