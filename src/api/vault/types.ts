import type { KnownVaultSystem } from './systems';

/** A known system identifier or another identifier supported by the site. */
export type VaultSystem = KnownVaultSystem | (string & {});

type VaultLetter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/** A–Z or numbered listing; letters and `number` are case-insensitive and validated at runtime. */
export type VaultSection = VaultLetter | Lowercase<VaultLetter> | '#' | 'number' | (string & {});

/** A game linked from a Vault search results table. */
export interface VaultGame {
  /** Numeric Vault entry ID. */
  id: number;
  /** Display title. */
  title: string;
  /** Canonical Vimm's Lair game page URL. */
  url: string;
  /** System identifier or listing text, when available. */
  system?: string;
  /** Region labels present in the listing. */
  regions: string[];
  /** Version text, when present. */
  version?: string;
  /** Language text, when present in a system-specific listing. */
  languages?: string;
  /** Rating text, when present in a system-specific listing. */
  rating?: string;
}

/** Options for searching the Vault. */
export interface VaultSearchOptions {
  /** Vimm's system identifier; omit to search across systems. */
  system?: VaultSystem;
}
