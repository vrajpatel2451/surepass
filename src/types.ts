export interface SurepassConfig {
  baseUrl: string;
  token: string;
  fetch?: typeof globalThis.fetch;
}

export interface GstVerification {
  legal_name: string;
  business_name: string;
  address: string;
  gstin: string;
  constitution_of_business: string;
}

export interface SurepassErrorBody {
  message?: string | null;
  [key: string]: unknown;
}
