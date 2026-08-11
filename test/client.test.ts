import { describe, expect, it, vi } from "vitest";
import { Surepass, SurepassConfigError, SurepassError } from "../src/index.js";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("Surepass", () => {
  it("verifies a GSTIN and returns only the public fields", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      json({
        data: {
          legal_name: "Legal Name",
          business_name: "Business Name",
          address: "Ahmedabad",
          gstin: "00GSGST0000G0ST",
          constitution_of_business: "Private Limited Company",
          pan_number: "AAPAN0000P",
        },
      }),
    );
    const surepass = new Surepass({
      baseUrl: "https://test.surepass.app/",
      token: "secret",
      fetch,
    });

    await expect(surepass.verifyGstin("00GSGST0000G0ST")).resolves.toEqual({
      legal_name: "Legal Name",
      business_name: "Business Name",
      address: "Ahmedabad",
      gstin: "00GSGST0000G0ST",
      constitution_of_business: "Private Limited Company",
      pan_number: "AAPAN0000P",
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://test.surepass.app/api/v1/corporate/gstin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ id_number: "00GSGST0000G0ST" }),
        headers: expect.objectContaining({ authorization: "Bearer secret" }),
      }),
    );
  });

  it("validates configuration and input", async () => {
    expect(() => new Surepass({ baseUrl: "", token: "" })).toThrow(
      SurepassConfigError,
    );
    const surepass = new Surepass({
      baseUrl: "https://example.com",
      token: "secret",
      fetch: vi.fn(),
    });
    await expect(surepass.verifyGstin("")).rejects.toThrow(SurepassConfigError);
  });

  it("throws a structured API error without leaking the token", async () => {
    const surepass = new Surepass({
      baseUrl: "https://example.com",
      token: "do-not-leak",
      fetch: vi
        .fn<typeof globalThis.fetch>()
        .mockResolvedValue(json({ message: "Invalid GSTIN" }, 422)),
    });
    const error: unknown = await surepass
      .verifyGstin("invalid")
      .catch((value) => value);
    expect(error).toBeInstanceOf(SurepassError);
    expect(error).toMatchObject({ status: 422, message: "Invalid GSTIN" });
    expect(JSON.stringify(error)).not.toContain("do-not-leak");
  });
});
