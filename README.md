# elhadji.dev

My personal portfolio, built with [Astro](https://astro.build) as a static site and deployed to GitHub Pages.

## Run it locally

Requires Node 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # production build in dist/
npm run preview   # serve that build locally
npm run check     # type-check the project
```

Analytics never load on localhost. In `npm run dev`, every event is logged to the browser console as `[track]` instead, so you can see what would be sent.

## Edit content

Almost everything is in one file: [`src/data/content.ts`](src/data/content.ts). That covers the bio, experience, projects, case studies and skills. No layout code needs to change.

- `**text**` renders as bold and `` `text` `` as inline code.
- Search for `TODO(elhadji)` to find what still needs input. TODOs are comments, so unfinished items are hidden from the page rather than shown as placeholders.

| To do this | Change this |
| --- | --- |
| Add a hike profile | Save a GPX file at `public/data/panorama.gpx`; the elevation line appears by itself |
| Add a Live link | Set the project's `live` to a URL |
| Update the resume | Replace `public/resume.pdf` |
| Replace the social card | Replace `public/og.png` (1200 × 630) |
| Add a project image | Save it in `src/assets/projects/`, import it in `content.ts`, and use it as `media` |

Images in `src/assets/` are converted to AVIF and WebP at build time. A project's `media` can also be a replayed terminal session: `kind: 'terminal'` with a list of lines.

The footer's "last updated" date is set automatically on each build.

## Deploy to GitHub Pages

The repository can have any name, because the custom domain serves the site from its root.

1. Push this project to `main` of a GitHub repository. On a free GitHub plan, the repository must be public for Pages to work.
2. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. If the first workflow run failed because Pages wasn't enabled yet, re-run it from the **Actions** tab.

Every push to `main` then runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Set the analytics IDs

Both IDs are in [`src/data/config.ts`](src/data/config.ts). A placeholder ID loads nothing, so you can deploy before setting them up.

**Google tag and GA4**

`googleTagId` is set to `GTM-WTX43B3Z`, a Google tag container that forwards to GA4 property `G-DH7V04D18R`. There's no separate GA4 ID to set, and adding a second Google tag would double count visits.

1. To see event details in standard reports, go to **Admin → Custom definitions** in GA4 and create event-scoped custom dimensions for: `platform`, `project`, `link_type`, `company`, `section`, `theme` and `url`. They only collect data from the moment you add them.
2. In your GA4 data stream, make sure the website URL is `https://elhadji.dev`.

**Umami**

1. At [cloud.umami.is](https://cloud.umami.is), add a website using your site URL.
2. Copy its website ID into `umamiWebsiteId`.

## Connect elhadji.dev

1. At your domain registrar, add these DNS records for `elhadji.dev`:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `elhadjisall.github.io` |

2. In the repository, go to **Settings → Pages → Custom domain**, enter `elhadji.dev` and save.
3. Once the DNS check passes and the certificate is issued, turn on **Enforce HTTPS**.
4. Optional but recommended: verify the domain under your account's **Settings → Pages**, so no other GitHub account can claim it.

`.dev` domains only work over HTTPS. Browsers will show a connection error rather than the site until GitHub has issued the certificate, which can take from a few minutes to about an hour after DNS is correct.

`SITE_URL` in `src/data/config.ts` is already set to `https://elhadji.dev`. If the domain changes, update it there. `CNAME.example` is only a record of the domain: GitHub ignores `CNAME` files on sites deployed with Actions, so the Settings page is what counts.

## Tracked events

All events go through `track()` in [`src/scripts/analytics.ts`](src/scripts/analytics.ts), which sends to both tools and does nothing if either is blocked.

| Event | Properties | Fires when |
| --- | --- | --- |
| `resume_download` | none | Resume button is clicked |
| `social_click` | `platform`: github, linkedin or email | A GitHub, LinkedIn or email button is clicked |
| `project_click` | `project`, `link_type`: live, code, case_study, report or slides | A project link is clicked |
| `experience_click` | `company` | An employer link is clicked |
| `nav_click` | `section` | A navigation link is clicked |
| `mayhem_click` | none | The Website Mayhem button is clicked |
| `theme_toggle` | `theme`: 8-bit or default | The 8-bit theme is switched |
| `outbound_link` | `url` | Any link to another site is clicked (automatic) |
| `section_view` | `section` | A section first scrolls into view on a page load |

When a visit arrives with UTM parameters, `utm_source`, `utm_medium` and `utm_campaign` are kept for the session and added to every event.

Key links also have `data-umami-event` attributes, so Umami counts them without any of this site's JavaScript. Those clicks are sent to GA4 from `analytics.ts` and not sent to Umami a second time, so nothing is double counted. Because Umami records those clicks directly, they don't carry the UTM properties there. Umami still shows UTM data for the visit under **Traffic**.

### Where to see them

| Question | GA4 | Umami |
| --- | --- | --- |
| Is tracking working right now? | **Reports → Realtime overview** (or **Admin → DebugView** with the Tag Assistant extension) | **Realtime** |
| How many times did each event fire? | **Reports → Engagement → Events** | **Events** |
| Who clicked what, by property? | Click an event name, or build a table in **Explore** using the custom dimensions above | **Events**, then click the event name to see its properties |
| Where did visitors come from? | **Reports → Acquisition → Traffic acquisition** | **Overview → Sources**, or **UTM** |
| Which sections do people actually read? | `section_view` by `section` in **Explore** | `section_view` under **Events** |

New GA4 events can take 24 to 48 hours to appear in standard reports, though they show up in Realtime within seconds. Menu names in both tools change from time to time.

## Campaign links

Use these so you can tell which link brought each visitor.

| Where | Link |
| --- | --- |
| Resume PDF | `https://elhadji.dev/?utm_source=resume&utm_medium=pdf` |
| LinkedIn profile | `https://elhadji.dev/?utm_source=linkedin&utm_medium=social` |
| GitHub profile README | `https://elhadji.dev/?utm_source=github&utm_medium=profile` |
| Google questionnaire | `https://elhadji.dev/?utm_source=google&utm_campaign=teammatch` |
| Job applications | `https://elhadji.dev/?utm_source=application&utm_campaign=company-name` |

For job applications, replace `company-name` with the company, for example `utm_campaign=microsoft`.

## Project layout

```text
src/data/content.ts     All site content
src/data/config.ts      Site URL and analytics IDs
src/pages/              Home, projects, case studies, 404, robots.txt, sitemap.xml
src/layouts/Base.astro  Shared head, SEO tags and analytics loader
src/components/         Page components
src/scripts/            Analytics, the animated skies (sky/), scroll fade, sidebar clock
src/styles/global.css   All styles and design tokens
public/                 Files served as they are
```
