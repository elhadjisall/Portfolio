import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/config';
import { projects } from '../data/content';

export const GET: APIRoute = () => {
  const paths = ['/', ...projects.map(({ slug }) => `/projects/${slug}/`)];
  const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
