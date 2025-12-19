import { describe, it, expect } from "vitest";
import { getBeltColor, getBeltName } from "../StudentUtils";
import type { Belt } from "../StudentTypes";

describe("StudentUtils", () => {
  describe("getBeltColor", () => {
    it("returns correct color for White belt", () => {
      expect(getBeltColor("White")).toBe("#e5e7eb");
    });

    it("returns correct color for Yellow belt", () => {
      expect(getBeltColor("Yellow")).toBe("#facc15");
    });

    it("returns correct color for Orange belt", () => {
      expect(getBeltColor("Orange")).toBe("#fb923c");
    });

    it("returns correct color for Green belt", () => {
      expect(getBeltColor("Green")).toBe("#16a34a");
    });

    it("returns correct color for Blue belt", () => {
      expect(getBeltColor("Blue")).toBe("#2563eb");
    });

    it("returns correct color for Brown belt", () => {
      expect(getBeltColor("Brown")).toBe("#78350f");
    });

    it("returns correct color for Black belt", () => {
      expect(getBeltColor("Black")).toBe("#1f2937");
    });

    it("returns all different colors for different belts", () => {
      const belts: Belt[] = [
        "White",
        "Yellow",
        "Orange",
        "Green",
        "Blue",
        "Brown",
        "Black",
      ];
      const colors = belts.map((belt) => getBeltColor(belt));

      // Verifica que não há cores duplicadas
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(belts.length);
    });

    it("returns valid hex color format", () => {
      const belts: Belt[] = [
        "White",
        "Yellow",
        "Orange",
        "Green",
        "Blue",
        "Brown",
        "Black",
      ];
      const hexColorRegex = /^#[0-9a-f]{6}$/i;

      belts.forEach((belt) => {
        const color = getBeltColor(belt);
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe("getBeltName", () => {
    it("returns correct name in Portuguese for White belt", () => {
      expect(getBeltName("White")).toBe("Branca");
    });

    it("returns correct name in Portuguese for Yellow belt", () => {
      expect(getBeltName("Yellow")).toBe("Amarela");
    });

    it("returns correct name in Portuguese for Orange belt", () => {
      expect(getBeltName("Orange")).toBe("Laranja");
    });

    it("returns correct name in Portuguese for Green belt", () => {
      expect(getBeltName("Green")).toBe("Verde");
    });

    it("returns correct name in Portuguese for Blue belt", () => {
      expect(getBeltName("Blue")).toBe("Azul");
    });

    it("returns correct name in Portuguese for Brown belt", () => {
      expect(getBeltName("Brown")).toBe("Marrom");
    });

    it("returns correct name in Portuguese for Black belt", () => {
      expect(getBeltName("Black")).toBe("Preta");
    });

    it("returns all different names for different belts", () => {
      const belts: Belt[] = [
        "White",
        "Yellow",
        "Orange",
        "Green",
        "Blue",
        "Brown",
        "Black",
      ];
      const names = belts.map((belt) => getBeltName(belt));

      // Verifica que não há nomes duplicados
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(belts.length);
    });
  });
});
