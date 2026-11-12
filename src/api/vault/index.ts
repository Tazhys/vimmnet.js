import { load } from 'cheerio';
import { VimmClient } from '../../client/BaseClient';
import type { VaultGame, VaultSearchOptions, VaultSection, VaultSystem } from './types';

/** Access to public Vault pages. Page markup can change without notice. */
export class VaultAPI {
  /** Creates a Vault API backed by an HTTP client. */
  constructor(private readonly client: VimmClient) { }

  /**
   * Searches Vault listings, optionally restricted to a system.
   * @param query Search text with at least three non-padding characters.
   * @param options Search options; omit `system` to search across systems.
   * @returns Games found in the results table.
   * @throws {TypeError} If the trimmed query has fewer than three characters.
   * @throws {Error} If the results table cannot be found.
   */
  async search(query: string, options: VaultSearchOptions = {}): Promise<VaultGame[]> {
    if (query.trim().length < 3) throw new TypeError('Search query must contain at least 3 characters');
    const system = options.system?.trim();
    const html = await this.client.get('vault/', { p: 'list', system: system ?? '', q: query });
    const $ = load(html);
    const table = $('table.rounded').first();
    if (!table.length) throw new Error('Vault search results table was not found; the site may have changed or blocked the request');
    const games: VaultGame[] = [];
    table.find('tr').each((_i, row) => {
      const cells = $(row).children('td');
      const titleIndex = system ? 0 : 1;
      const link = cells.eq(titleIndex).find('a[href]').first();
      const href = link.attr('href');
      if (!href) return;
      const match = href.match(/(?:^|\/)vault\/(\d+)(?:[/?#]|$)/);
      if (!match) return;
      const regions: string[] = [];
      cells.eq(titleIndex + 1).find('img[title]').each((_j, img) => {
        const region = $(img).attr('title')?.trim();
        if (region) regions.push(region);
      });
      const text = (index: number) => cells.eq(index).text().trim() || undefined;
      games.push({
        id: Number(match[1]), title: link.text().trim(),
        url: `https://vimm.net/vault/${match[1]}`,
        system: system || text(0), regions, version: text(titleIndex + 2),
        languages: system ? text(titleIndex + 3) : undefined,
        rating: system ? text(titleIndex + 4) : undefined
      });
    });
    return games;
  }

  /**
   * Fetches a system's alphabetical or numbered listing as HTML.
   * @param system Vault system identifier, such as `Xbox360`.
   * @param section A letter A–Z, `#`, or `number`; letters and `number` are case-insensitive.
   * @returns The listing page HTML.
   * @throws {TypeError} If the system identifier or section is invalid.
   */
  async getSectionPage(system: VaultSystem, section: VaultSection): Promise<string> {
    if (!/^[a-zA-Z0-9-]+$/.test(system)) throw new TypeError('Invalid system identifier');
    if (section.toLowerCase() === 'number' || section === '#') {
      return this.client.get('vault/', { p: 'list', system, section: 'number' });
    }
    if (!/^[a-z]$/i.test(section)) throw new TypeError('Section must be A-Z or number');
    return this.client.get(`vault/${system}/${section.toUpperCase()}`);
  }

  /**
   * Fetches an individual Vault entry page as HTML.
   * @param id Positive integer Vault entry ID.
   * @returns The game page HTML.
   * @throws {TypeError} If the ID is not a positive integer.
   */
  async getGamePage(id: number | string): Promise<string> {
    const value = String(id);
    if (!/^[1-9]\d*$/.test(value)) throw new TypeError('Game ID must be a positive integer');
    return this.client.get(`vault/${value}`);
  }
}

export type { VaultGame, VaultSearchOptions, VaultSection, VaultSystem } from './types';
export { VAULT_SYSTEMS } from './systems';
export type { KnownVaultSystem } from './systems';
