# Umami

The page can report visitors, geography, and referrers through [Umami](https://umami.is). Umami Cloud does this without a backend of your own. The tracker stays off until `config.js` has a website id.

## Umami Cloud

1. Create a free account at https://cloud.umami.is.
2. Add a website. Use the URL where this portfolio is hosted.
3. Copy the website id.
4. Paste it into `config.js`:

```js
export const UMAMI_WEBSITE_ID = "the-id-from-umami";
```

5. Leave `UMAMI_SCRIPT_SRC` as `https://cloud.umami.is/script.js`.

Reload the site. The script tag is injected only when the id is non-empty. Geography, pages, and referrers show up in the Umami dashboard. Nothing else on this site has to store analytics.

## Self-hosted

Run Umami yourself, add the site there, and set both values in `config.js`:

```js
export const UMAMI_WEBSITE_ID = "the-id-from-your-instance";
export const UMAMI_SCRIPT_SRC = "https://your-umami-host/script.js";
```

That script is the same one Umami Cloud documents:

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="YOUR_WEBSITE_ID"></script>
```

`analytics.js` builds that tag from `config.js` and skips it when the id is blank.
