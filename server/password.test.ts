import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  estimateEntropy,
  generatePassword,
  getCharacterPool,
  type PasswordSettings,
} from "../client/src/lib/password";

const settings: PasswordSettings = {
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: true,
  excludeAmbiguous: false,
};

let randomFill: ReturnType<typeof vi.fn>;

beforeEach(() => {
  randomFill = vi.fn((bytes: Uint8Array) => {
    bytes.fill(0);
    return bytes;
  });
  vi.stubGlobal("crypto", { getRandomValues: randomFill } as unknown as Crypto);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PassForge password generation", () => {
  it("creates exact-length passwords containing every selected character type", () => {
    const password = generatePassword(settings);

    expect(password).toHaveLength(settings.length);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()_+=\[\]{};:,.?/\\|~`'"<>-]/);
    expect(password).not.toMatch(/[O0Il]/);
    expect(randomFill).toHaveBeenCalled();
  });

  it("uses crypto.getRandomValues rather than Math.random", () => {
    const mathRandom = vi.spyOn(Math, "random");
    generatePassword(settings);
    expect(randomFill).toHaveBeenCalled();
    expect(mathRandom).not.toHaveBeenCalled();
  });

  it("rejects out-of-range bytes instead of introducing modulo bias", () => {
    const sequence = [255, 0];
    randomFill.mockImplementation((bytes: Uint8Array) => {
      bytes[0] = sequence.shift() ?? 0;
      return bytes;
    });

    const password = generatePassword({ ...settings, length: 8, uppercase: false, numbers: false, symbols: false, lowercase: true });
    expect(password).toHaveLength(8);
    expect(password).toMatch(/^[a-z]+$/);
    expect(randomFill.mock.calls.length).toBeGreaterThan(8);
  });

  it("removes ambiguous symbols when the exclusion is enabled", () => {
    const pool = getCharacterPool({ ...settings, excludeAmbiguous: true });
    expect(pool.combined).not.toMatch(/[\[\]{}()<>/\\|`'"~,;:.]/);
  });

  it("reports zero entropy when no character set is selected", () => {
    const invalid = { ...settings, uppercase: false, lowercase: false, numbers: false, symbols: false };
    expect(() => generatePassword(invalid)).toThrow(/at least one character set/i);
    expect(estimateEntropy(invalid)).toBe(0);
  });

  it("estimates entropy from the actual selected pool and length", () => {
    const lowerOnly = { ...settings, length: 10, uppercase: false, numbers: false, symbols: false, lowercase: true, excludeSimilar: false };
    expect(estimateEntropy(lowerOnly)).toBeCloseTo(10 * Math.log2(26));
  });
});
