import { describe, it, expect } from "vitest";
import { getBeltColor } from "../StudentUtils";
import type { Belt } from "../StudentTypes";

describe("StudentUtils", () => {
  describe("getBeltColor", () => {
    it("returns correct color for branca belt", () => {
      expect(getBeltColor("branca")).toBe("#e5e7eb");
    });

    it("returns correct color for amarela belt", () => {
      expect(getBeltColor("amarela")).toBe("#facc15");
    });

    it("returns correct color for laranja belt", () => {
      expect(getBeltColor("laranja")).toBe("#fb923c");
    });

    it("returns correct color for verde belt", () => {
      expect(getBeltColor("verde")).toBe("#16a34a");
    });

    it("returns correct color for azul belt", () => {
      expect(getBeltColor("azul")).toBe("#2563eb");
    });

    it("returns correct color for marrom belt", () => {
      expect(getBeltColor("marrom")).toBe("#78350f");
    });

    it("returns correct color for preta belt", () => {
      expect(getBeltColor("preta")).toBe("#1f2937");
    });

    it("returns all different colors for different belts", () => {
      const belts: Belt[] = [
        "branca",
        "amarela",
        "laranja",
        "verde",
        "azul",
        "marrom",
        "preta",
      ];
      const colors = belts.map((belt) => getBeltColor(belt));

      // Verifica que não há cores duplicadas
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(belts.length);
    });

    it("returns valid hex color format", () => {
      const belts: Belt[] = [
        "branca",
        "amarela",
        "laranja",
        "verde",
        "azul",
        "marrom",
        "preta",
      ];
      const hexColorRegex = /^#[0-9a-f]{6}$/i;

      belts.forEach((belt) => {
        const color = getBeltColor(belt);
        expect(color).toMatch(hexColorRegex);
      });
    });
  });
});
