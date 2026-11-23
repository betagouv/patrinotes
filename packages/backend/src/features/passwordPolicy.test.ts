import { describe, expect, it } from "vitest";
import { assertPasswordIsStrongEnough, isPasswordStrongEnough } from "./passwordPolicy";

describe("isPasswordStrongEnough (same rules as the signup / reset-password forms)", () => {
  it("accepts a password with 8 characters, upper and lower case, a digit and a special character", () => {
    expect(isPasswordStrongEnough("Abcdef1!")).toBe(true);
    expect(isPasswordStrongEnough("Patrimoine 2026")).toBe(true);
    // accented letters are not A-Z / a-z: the form counts them as special characters
    expect(isPasswordStrongEnough("Abcdefé1")).toBe(true);
  });

  it("refuses a password missing one of the rules", () => {
    expect(isPasswordStrongEnough("Abcde1!")).toBe(false); // 7 characters
    expect(isPasswordStrongEnough("abcdef1!")).toBe(false); // no uppercase
    expect(isPasswordStrongEnough("ABCDEF1!")).toBe(false); // no lowercase
    expect(isPasswordStrongEnough("Abcdefg!")).toBe(false); // no digit
    expect(isPasswordStrongEnough("Abcdefg1")).toBe(false); // no special character
    expect(isPasswordStrongEnough("")).toBe(false);
  });

  it("throws a 400 error for a weak password", () => {
    expect(() => assertPasswordIsStrongEnough("password")).toThrow(/au moins 8 caractères/);
    expect(() => assertPasswordIsStrongEnough("Abcdef1!")).not.toThrow();
  });
});
