import { expect, it, vi } from 'vitest';
import { Surepass } from '../../src/index.js';

it('performs the public GST verification flow over HTTP', async () => {
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(JSON.stringify({
    data: {
      legal_name: 'DEMAZE TECH STUDIO PRIVATE LIMITED',
      business_name: 'DEMAZE TECH STUDIO PRIVATE LIMITED',
      address: 'Ahmedabad, Gujarat, 382470',
      gstin: '24AALCD9657Q1ZO',
      constitution_of_business: 'Private Limited Company',
    },
  })));
  const sdk = new Surepass({ baseUrl: 'https://sandbox.surepass.app', token: 'e2e-token', fetch });

  await expect(sdk.verifyGstin('24AALCD9657Q1ZO')).resolves.toEqual({
    legal_name: 'DEMAZE TECH STUDIO PRIVATE LIMITED',
    business_name: 'DEMAZE TECH STUDIO PRIVATE LIMITED',
    address: 'Ahmedabad, Gujarat, 382470',
    gstin: '24AALCD9657Q1ZO',
    constitution_of_business: 'Private Limited Company',
  });
});
