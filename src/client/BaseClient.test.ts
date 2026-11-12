import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { VimmClient } from './BaseClient';

describe('VimmClient User-Agent', () => {
  it('uses its fixed User-Agent even when custom headers use different casing', () => {
    const create = vi.spyOn(axios, 'create');
    try {
      new VimmClient({ headers: { 'user-agent': 'custom', 'USER-AGENT': 'another', 'Accept-Language': 'en-US' } });
      const headers = create.mock.calls[0][0]?.headers;
      expect(headers).toEqual({ Accept: 'text/html', 'Accept-Language': 'en-US', 'User-Agent': 'vimmnet.js/1.0.0' });
    } finally {
      create.mockRestore();
    }
  });
});
