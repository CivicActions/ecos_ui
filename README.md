# Health Plan Calculator Demo App

This is a health insurance plan finder and calculator application demo created with Astro and Preact. It leverages the healthcare.gov design system and consumes data from the Marketplace API (https://developer.cms.gov/marketplace-api/).

In order to successfully connect to Marketplace API, create a `.env` file in the root of the project with the following environment variables

```
MARKETPLACE_API_KEY = "<API KEY>"
MARKETPLACE_BASE_URL = "<Marketplace API Base URL>"
```

API keys for the Marketplace API may be requested here: https://developer.cms.gov/marketplace-api/key-request.html

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

