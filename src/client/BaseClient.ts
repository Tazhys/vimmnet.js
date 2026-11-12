import axios, { AxiosError, AxiosInstance } from 'axios';

/** Options shared by requests to Vimm's Lair. */
export interface VimmClientConfig {
  /** Base URL for requests. Defaults to `https://vimm.net/`. */
  baseURL?: string;
  /** Request timeout in milliseconds. Defaults to 15,000. */
  timeout?: number;
  /** Maximum retries for HTTP 429 and 5xx responses. Defaults to 3. */
  retries?: number;
  /** Initial retry delay in milliseconds, doubled after each retry. Defaults to 1,000. */
  retryDelay?: number;
  /** Additional request headers; User-Agent is managed by the client. */
  headers?: Record<string, string>;
}

/** An HTTP error response from Vimm's Lair. Network errors are passed through. */
export class VimmAPIError extends Error {
  /** Creates an error with the HTTP status and response body. */
  constructor(public readonly status: number, public readonly body: unknown) {
    super(`Vimm's Lair returned HTTP ${status}`);
    this.name = 'VimmAPIError';
  }
}

/** HTTP client for public Vimm's Lair HTML pages. */
export class VimmClient {
  private readonly client: AxiosInstance;
  private readonly retries: number;
  private readonly retryDelay: number;

  /** Creates an HTTP client with optional request and retry settings. */
  constructor(config: VimmClientConfig = {}) {
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
    if (!Number.isInteger(this.retries) || this.retries < 0 || this.retryDelay < 0) {
      throw new RangeError('retries must be a non-negative integer and retryDelay must be non-negative');
    }
    const headers: Record<string, string> = { Accept: 'text/html', ...config.headers };
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === 'user-agent') delete headers[key];
    }
    if ((globalThis as any).process?.versions?.node) {
      headers['User-Agent'] = 'vimmnet.js/1.0.0';
    }
    this.client = axios.create({ baseURL: config.baseURL ?? 'https://vimm.net/', timeout: config.timeout ?? 15000, headers });
  }

  /**
   * Fetches a page as text, retrying HTTP 429 and 5xx responses.
   * @param endpoint Path relative to the configured base URL.
   * @param params Optional query parameters.
   * @returns The response body as text.
   * @throws {VimmAPIError} If the final response has an error status.
   */
  async get(endpoint: string, params?: Record<string, string>): Promise<string> {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await this.client.get<string>(endpoint, { params, responseType: 'text' });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status !== undefined && (status === 429 || status >= 500) && attempt < this.retries) {
          await new Promise<void>(resolve => setTimeout(resolve, this.retryDelay * 2 ** attempt));
          continue;
        }
        if (status !== undefined) throw new VimmAPIError(status, axiosError.response?.data);
        throw error;
      }
    }
  }
}
