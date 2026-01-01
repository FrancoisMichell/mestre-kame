import { describe, it, expect } from "vitest";
import { beltConfigs } from "../beltConfig";
import type { Belt } from "../StudentTypes";

describe("beltConfig", () => {
  describe("beltConfigs colors", () => {
    it("returns correct color for White belt", () => {
      expect(beltConfigs.white.color).toBe("#e5e7eb");
    });

    it("returns correct color for Yellow belt", () => {
      expect(beltConfigs.yellow.color).toBe("#facc15");
    });

    it("returns correct color for Orange belt", () => {
      expect(beltConfigs.orange.color).toBe("#fb923c");
    });

    it("returns correct color for Green belt", () => {
      expect(beltConfigs.green.color).toBe("#16a34a");
    });

    it("returns correct color for Blue belt", () => {
      expect(beltConfigs.blue.color).toBe("#2563eb");
    });

    it("returns correct color for Brown belt", () => {
      expect(beltConfigs.brown.color).toBe("#78350f");
    });

    it("returns correct color for Black belt", () => {
      expect(beltConfigs.black.color).toBe("#1f2937");
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
      const colors = belts.map((belt) => beltConfigs[belt].color);

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
        const color = beltConfigs[belt].color;
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe("beltConfigs names", () => {
    it("returns correct name in Portuguese for White belt", () => {
      expect(beltConfigs.white.name).toBe("Branca");
    });

    it("returns correct name in Portuguese for Yellow belt", () => {
      expect(beltConfigs.yellow.name).toBe("Amarela");
    });

    it("returns correct name in Portuguese for Orange belt", () => {
      expect(beltConfigs.orange.name).toBe("Laranja");
    });

    it("returns correct name in Portuguese for Green belt", () => {
      expect(beltConfigs.green.name).toBe("Verde");
    });

    it("returns correct name in Portuguese for Blue belt", () => {
      expect(beltConfigs.blue.name).toBe("Azul");
    });

    it("returns correct name in Portuguese for Brown belt", () => {
      expect(beltConfigs.brown.name).toBe("Marrom");
    });

    it("returns correct name in Portuguese for Black belt", () => {
      expect(beltConfigs.black.name).toBe("Preta");
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
      const names = belts.map((belt) => beltConfigs[belt].name);

      // Verifica que não há nomes duplicados
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(belts.length);
    });
  });
});
