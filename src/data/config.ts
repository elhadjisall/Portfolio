/**
 * Site-wide settings. Everything you may need to change for hosting or
 * analytics lives here, and nowhere else.
 */

/** Public URL. Canonical links, social tags and the sitemap all use this. */
export const SITE_URL = 'https://elhadji.dev';

export const analytics = {
  /**
   * Your Google tag (a Tag Manager container). It forwards everything to GA4
   * property G-DH7V04D18R, so GA4 needs no separate ID here.
   */
  googleTagId: 'GTM-WTX43B3Z',
  /** Your Umami website ID (Settings → Websites → Edit). */
  umamiWebsiteId: 'eaa21882-d391-46ec-a94a-6fc41638b9aa',
  umamiScriptSrc: 'https://cloud.umami.is/script.js',
};

/**
 * The placeholder values above never load a tracker, so the site works and
 * makes no third-party requests until you add real IDs. Trackers also stay
 * off on localhost: see the bootstrap script in src/layouts/Base.astro.
 */
export const analyticsPlaceholders = ['GTM-XXXXXXX', 'UMAMI_WEBSITE_ID'];
