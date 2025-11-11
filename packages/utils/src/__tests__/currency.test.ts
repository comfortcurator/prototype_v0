import { describe, expect, it } from "vitest";
import { formatINRCurrency } from "../currency";

describe("formatINRCurrency", () => {
  it("formats integer amounts", () => {
    expect(formatINRCurrency(123456)).toBe("₹1,23,456");
  });

  it("respects decimal precision", () => {
    expect(formatINRCurrency(1234.56)).toBe("₹1,234.56");
  });
});

