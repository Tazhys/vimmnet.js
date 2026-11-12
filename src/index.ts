import { VimmClient, VimmClientConfig } from './client/BaseClient';
import { VaultAPI } from './api/vault';

/** Unofficial client for Vimm's Lair. */
export class VimmNet {
  /** Methods for searching and browsing public Vault pages. */
  public readonly vault: VaultAPI;

  /** Creates a client with optional HTTP configuration. */
  constructor(config: VimmClientConfig = {}) {
    this.vault = new VaultAPI(new VimmClient(config));
  }
}

export { VimmClient, VimmAPIError } from './client/BaseClient';
export type { VimmClientConfig } from './client/BaseClient';
export { VaultAPI, VAULT_SYSTEMS } from './api/vault';
export type { VaultGame, VaultSearchOptions, VaultSection, VaultSystem, KnownVaultSystem } from './api/vault';
