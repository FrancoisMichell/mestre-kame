import { describe, it, expect } from "vitest";
import { getBeltColor, getBeltName } from "../StudentUtils";
import type { Belt } from "../StudentTypes";

describe("StudentUtils", () => {
  describe("getBeltColor", () => {
    it("returns correct color for White belt", () => {
      expect(getBeltColor("white")).toBe("#e5e7eb");
    });

    it("returns correct color for Yellow belt", () => {
      expect(getBeltColor("yellow")).toBe("#facc15");
    });

    it("returns correct color for Orange belt", () => {
      expect(getBeltColor("orange")).toBe("#fb923c");
    });

    it("returns correct color for Green belt", () => {
      expect(getBeltColor("green")).toBe("#16a34a");
    });

    it("returns correct color for Blue belt", () => {
      expect(getBeltColor("blue")).toBe("#2563eb");
    });

    it("returns correct color for Brown belt", () => {
      expect(getBeltColor("brown")).toBe("#78350f");
    });

    it("returns correct color for Black belt", () => {
      expect(getBeltColor("black")).toBe("#1f2937");
    });

    it("returns all different colors for different belts", () => {
      const belts: Belt[] = [
        "white",
        "yellow",
        "orange",
        "green",
        "blue",
        "brown",
        "black",
      ];
      const colors = belts.map((belt) => getBeltColor(belt));

      // Verifica que não há cores duplicadas
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(belts.length);
    });

    it("returns valid hex color format", () => {
      const belts: Belt[] = [
        "white",
        "yellow",
        "orange",
        "green",
        "blue",
        "brown",
        "black",
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
      expect(getBeltName("white")).toBe("Branca");
    });

    it("returns correct name in Portuguese for Yellow belt", () => {
      expect(getBeltName("yellow")).toBe("Amarela");
    });

    it("returns correct name in Portuguese for Orange belt", () => {
      expect(getBeltName("orange")).toBe("Laranja");
    });

    it("returns correct name in Portuguese for Green belt", () => {
      expect(getBeltName("green")).toBe("Verde");
    });

    it("returns correct name in Portuguese for Blue belt", () => {
      expect(getBeltName("blue")).toBe("Azul");
    });

    it("returns correct name in Portuguese for Brown belt", () => {
      expect(getBeltName("brown")).toBe("Marrom");
    });

    it("returns correct name in Portuguese for Black belt", () => {
      expect(getBeltName("black")).toBe("Preta");
    });

    it("returns all different names for different belts", () => {
      const belts: Belt[] = [
        "white",
        "yellow",
        "orange",
        "green",
        "blue",
        "brown",
        "black",
      ];
      const names = belts.map((belt) => getBeltName(belt));

      // Verifica que não há nomes duplicados
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(belts.length);
    });
  });
});
