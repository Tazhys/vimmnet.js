/** Snapshot of systems listed in the Vault navigation. */
export const VAULT_SYSTEMS = {
  Atari2600: 'Atari 2600', Atari5200: 'Atari 5200', NES: 'Nintendo',
  SMS: 'Master System', Atari7800: 'Atari 7800', TG16: 'TurboGrafx-16',
  Genesis: 'Genesis', TGCD: 'TurboGrafx-CD', SNES: 'Super Nintendo',
  CDi: 'CD-i', SegaCD: 'Sega CD', Jaguar: 'Jaguar', '32X': 'Sega 32X',
  Saturn: 'Saturn', PS1: 'PlayStation', JaguarCD: 'Jaguar CD',
  N64: 'Nintendo 64', Dreamcast: 'Dreamcast', PS2: 'PlayStation 2',
  GameCube: 'GameCube', Xbox: 'Xbox', Xbox360: 'Xbox 360',
  'X360-D': 'Xbox 360 (Digital)', PS3: 'PlayStation 3', Wii: 'Wii',
  WiiWare: 'WiiWare', WiiU: 'Wii U', GB: 'Game Boy', Lynx: 'Lynx',
  GG: 'Game Gear', VB: 'Virtual Boy', GBC: 'Game Boy Color',
  GBA: 'Game Boy Adv', DS: 'Nintendo DS', PSP: 'PS Portable', '3DS': 'Nintendo 3DS'
} as const;

/** A system identifier included in the `VAULT_SYSTEMS` snapshot. */
export type KnownVaultSystem = keyof typeof VAULT_SYSTEMS;
