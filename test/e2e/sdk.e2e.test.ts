import { expect, it, vi } from "vitest";
import { Surepass } from "../../src/index.js";

it("performs the public GST verification flow over HTTP", async () => {
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
    new Response(
      JSON.stringify({
        data: {
          legal_name: "Legal Name",
          business_name: "Business Name",
          address: "Ahmedabad",
          gstin: "00GSGST0000G0ST",
          constitution_of_business: "Private Limited Company",
          pan_number: "AAPAN0000P",
        },
      }),
    ),
  );
  const sdk = new Surepass({
    baseUrl: "https://sandbox.surepass.app",
    token: "e2e-token",
    fetch,
  });

  await expect(sdk.verifyGstin("00GSGST0000G0ST")).resolves.toEqual({
    legal_name: "Legal Name",
    business_name: "Business Name",
    address: "Ahmedabad",
    gstin: "00GSGST0000G0ST",
    constitution_of_business: "Private Limited Company",
    pan_number: "AAPAN0000P",
  });
});
