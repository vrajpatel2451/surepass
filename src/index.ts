import { SurepassConfigError, SurepassError } from './errors.js';
import type { GstVerification, SurepassConfig } from './types.js';

interface GstResponse {
  data: {
    legal_name: string;
    business_name: string;
    address: string;
    gstin: string;
    constitution_of_business: string;
  };
}

export class Surepass {
  readonly #baseUrl: string;
  readonly #token: string;
  readonly #fetch: typeof fetch;

  constructor(config: SurepassConfig) {
    if (!config.baseUrl.trim()) throw new SurepassConfigError('baseUrl is required');
    if (!config.token.trim()) throw new SurepassConfigError('token is required');
    this.#baseUrl = config.baseUrl.replace(/\/$/, '');
    this.#token = config.token;
    this.#fetch = config.fetch ?? globalThis.fetch;
    if (!this.#fetch) throw new SurepassConfigError('A fetch implementation is required');
  }

  async verifyGstin(gstin: string, signal?: AbortSignal): Promise<GstVerification> {
    if (!gstin.trim()) throw new SurepassConfigError('gstin is required');

    const response = await this.#fetch(`${this.#baseUrl}/api/v1/corporate/gstin`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${this.#token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id_number: gstin }),
      ...(signal ? { signal } : {}),
    });
    const text = await response.text();
    let body: unknown = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    if (!response.ok) {
      const message = typeof body === 'object' && body && 'message' in body && body.message
        ? String(body.message)
        : `Surepass request failed (${response.status})`;
      throw new SurepassError(message, response.status, body as never);
    }

    const data = (body as GstResponse).data;
    return {
      legal_name: data.legal_name,
      business_name: data.business_name,
      address: data.address,
      gstin: data.gstin,
      constitution_of_business: data.constitution_of_business,
    };
  }
}

export * from './errors.js';
export type * from './types.js';
