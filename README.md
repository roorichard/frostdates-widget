# FrostDates Widget

Embeddable frost date and USDA growing zone widget for any website. Drop it onto your page with two lines of HTML — your visitors can look up frost dates, growing zones, and frost risk timelines for any location worldwide.

Free to use. Powered by [frostdates.com](https://frostdates.com).

## Features

- **Frost dates** — First and last frost dates for air frost, light ground frost, and hard ground frost
- **USDA growing zones** — Hardiness zone calculated from historical climate data
- **Frost risk timeline** — Visual bar showing frost risk levels throughout the year
- **Location search** — Typeahead search for any town, postal code, or coordinates worldwide
- **Light and dark themes** — Fits any website design
- **Tiny footprint** — ~5 KB gzipped, no dependencies
- **Style isolation** — Uses Shadow DOM so it won't interfere with your site's CSS

## Quick Start

Add these two lines to any HTML page:

```html
<frostdates-widget site-id="YOUR_SITE_ID"></frostdates-widget>
<script src="https://cdn.frostdates.com/widget/v1/frostdates-widget.iife.js"></script>
```

Get your free site ID at [frostdates.com/developers/widget](https://frostdates.com/developers/widget).

## Configuration

Configure the widget using HTML attributes:

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `site-id` | Yes | — | Your registered site ID |
| `theme` | No | `light` | `light` or `dark` |
| `branding` | No | `true` | Show "Powered by frostdates.com" (paid plans can set to `false`) |

### Dark theme

```html
<frostdates-widget site-id="YOUR_SITE_ID" theme="dark"></frostdates-widget>
```

## JavaScript API

You can also create widgets programmatically:

```javascript
FrostDatesWidget.init({
  siteId: 'YOUR_SITE_ID',
  container: '#my-container',  // CSS selector or DOM element
  theme: 'light',              // optional
});
```

## Free vs Paid

| | Free | Paid |
|---|---|---|
| Lookups per visitor | 2 per day | Unlimited (per your plan) |
| Location search | Yes | Yes |
| Frost dates & USDA zones | Yes | Yes |
| Frost risk timeline | Yes | Yes |
| Light & dark themes | Yes | Yes |
| "Powered by frostdates.com" | Shown | Hidden |

The free tier is great for personal sites, blogs, and small communities. Paid plans are available via [frostdates.com/developers](https://frostdates.com/developers) and unlock unlimited lookups with optional branding removal.

## How It Works

The widget is a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (`<frostdates-widget>`) that uses Shadow DOM for style isolation. It communicates with the [frostdates.com](https://frostdates.com) API to fetch frost date data.

Your API key is never exposed to the browser. The widget sends a public site ID, and the server validates the request origin against your registered domain before proxying the request.

## WordPress

A dedicated WordPress plugin is coming soon. In the meantime, you can use the widget on any WordPress site:

1. Edit your page or post
2. Add a **Custom HTML** block
3. Paste the two lines from the [Quick Start](#quick-start) section
4. Publish or update

## Development

```bash
# Install dependencies
npm install

# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Links

- [Widget documentation](https://frostdates.com/developers/widget) — Full setup guide with examples
- [Developer tools](https://frostdates.com/developers) — API and widget overview
- [API documentation](https://frostdates.com/developers/docs) — REST API reference
- [frostdates.com](https://frostdates.com) — Look up frost dates for any location worldwide

## License

[MIT](LICENSE)
