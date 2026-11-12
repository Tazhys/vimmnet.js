# vimmnet.js

An unofficial TypeScript client for [Vimm's Lair](https://vimm.net/). It searches the Vault's public HTML listings and retrieves individual game pages. This project is not affiliated with Vimm's Lair.

**This package does not provide a way to download games from the library or automate game downloads.** It is intended for browsing and cataloguing public listing information.

## Installation

```sh
npm install vimmnet.js
```

## Usage

```ts
import { VimmNet, VAULT_SYSTEMS } from "vimmnet.js";

const vimm = new VimmNet();
const games = await vimm.vault.search("sonic", { system: "Genesis" });
for (const game of games) {
  console.log(game.id, game.title, game.regions, game.url);
}

// Omit system to search across systems.
const allSystems = await vimm.vault.search("sonic");
const html = await vimm.vault.getGamePage(9663);
console.log(VAULT_SYSTEMS["X360-D"]); // Xbox 360 (Digital)
const listingHtml = await vimm.vault.getSectionPage("Xbox360", "A");
const numberedHtml = await vimm.vault.getSectionPage("Xbox360", "#");
```

`search` requires at least three characters and returns `VaultGame[]` with an ID, title, canonical URL, regions, and any available system, version, languages, and rating text. Use the site's system identifier (for example `NES`, `PS2`, or `GameCube`). `VAULT_SYSTEMS` lists 36 Vault system identifiers; it is a snapshot and may change. Other system strings are accepted for forward compatibility. `getSectionPage` returns the HTML for A–Z or the numbered listing. `getGamePage` returns the page HTML; it does not download game files.

The site serves HTML rather than a documented JSON API. Page layout, availability, and access restrictions can change; a missing results table produces an error instead of silently returning an empty list. Please use the site responsibly.

## Configuration and errors

```ts
const vimm = new VimmNet({
  baseURL: "https://vimm.net/",
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
  headers: { "Accept-Language": "en-US" }
});
```

Node.js requests use the fixed User-Agent `vimmnet.js/1.0.0`. User-Agent entries in `headers` are ignored; browsers control their own User-Agent header.

Retries use exponential backoff for HTTP 429 and 5xx responses. HTTP errors are exposed as `VimmAPIError` with `status` and `body`; network errors are passed through. `VimmClient`, `VaultAPI`, and types are also available through the `/client`, `/vault`, and `/types` subpath exports.

## Development

Run `npm install`, `npm test`, `npm run type-check`, and `npm run build`. Node.js 16 or newer is required.

MIT licensed. See [LICENSE](LICENSE).
