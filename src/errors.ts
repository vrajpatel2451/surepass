import type { SurepassErrorBody } from './types.js';

export class SurepassError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: SurepassErrorBody | string | null,
  ) {
    super(message);
    this.name = 'SurepassError';
  }
}

export class SurepassConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurepassConfigError';
  }
}
