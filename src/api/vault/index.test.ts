import { describe, expect, it, vi } from 'vitest';
import { VaultAPI } from './index';
import { VimmClient } from '../../client/BaseClient';

function setup(html: string) {
  const get = vi.fn().mockResolvedValue(html);
  return { vault: new VaultAPI({ get } as unknown as VimmClient), get };
}

describe('VaultAPI', () => {
  it('parses a system listing and sends the query as parameters', async () => {
    const { vault, get } = setup('<table class="rounded"><tr><th>Game</th></tr><tr><td><a href="/vault/9663">Sonic &amp; Knuckles</a></td><td><img title="USA"></td><td>1.0</td><td>En</td><td><a>9.2</a></td></tr></table>');
    expect(await vault.search('sonic & knuckles', { system: 'Genesis' })).toEqual([{ id: 9663, title: 'Sonic & Knuckles', url: 'https://vimm.net/vault/9663', system: 'Genesis', regions: ['USA'], version: '1.0', languages: 'En', rating: '9.2' }]);
    expect(get).toHaveBeenCalledWith('vault/', { p: 'list', system: 'Genesis', q: 'sonic & knuckles' });
  });
  it('parses cross-system rows and ignores non-game links', async () => {
    const { vault } = setup('<table class="rounded"><tr><td>PS2</td><td><a href="/vault/42">Example</a></td><td></td><td>Rev 1</td></tr><tr><td>PS2</td><td><a href="/other">Other</a></td></tr></table>');
    expect(await vault.search('Example')).toMatchObject([{ id: 42, system: 'PS2', regions: [], version: 'Rev 1' }]);
  });
  it('fails visibly on unexpected HTML and validates input', async () => {
    const { vault, get } = setup('<html>Blocked</html>');
    await expect(vault.search('example')).rejects.toThrow('results table');
    await expect(vault.search('ab')).rejects.toThrow('at least 3');
    await expect(vault.getGamePage('../42')).rejects.toThrow('positive integer');
    await vault.getGamePage(42);
    expect(get).toHaveBeenLastCalledWith('vault/42');
  });
  it('uses the observed alphabetical and number listing routes', async () => {
    const { vault, get } = setup('<html></html>');
    await vault.getSectionPage('Xbox360', 'a');
    expect(get).toHaveBeenLastCalledWith('vault/Xbox360/A');
    await vault.getSectionPage('X360-D', '#');
    expect(get).toHaveBeenLastCalledWith('vault/', { p: 'list', system: 'X360-D', section: 'number' });
    await expect(vault.getSectionPage('../PS2', 'A')).rejects.toThrow('Invalid system');
    await expect(vault.getSectionPage('PS2', 'AA')).rejects.toThrow('Section');
  });
});
