# Guardian website front page

A recreation of the Guardian news website front page.

Created using Javascript, jQuery and SASS (and Vite).

## Features

- Fully responsive webpage
- Fetches articles from the Guardian API at https://open-platform.theguardian.com/
- Fetches live weather from Open Weather at https://openweathermap.org/api
- Color codes articles according to Guardian's color system: https://design.theguardian.com/#colour-palette
- Note the typography is not accurate as the fonts are commercial and can to be purchased at https://commercialtype.com/catalog/guardian

## Instructions

To run in development mode:

```
npx vite
```

To build for production:

```
npx vite build
```

Requires API keys for the Guardian and Open Weather API in environment variables to run:

```
VITE_GUARDIAN_API_KEY
VITE_WEATHER_API_KEY
```
