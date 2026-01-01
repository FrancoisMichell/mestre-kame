import type { Belt } from "./StudentTypes";

export interface BeltConfig {
  value: Belt;
  name: string;
  color: string;
}

export const beltConfigs: Record<Belt, BeltConfig> = {
  white: {
    value: "white",
    name: "Branca",
    color: "#e5e7eb", // Cinza claro (quase branco, para contraste)
  },
  yellow: {
    value: "yellow",
    name: "Amarela",
    color: "#facc15", // Amarelo 500
  },
  orange: {
    value: "orange",
    name: "Laranja",
    color: "#fb923c", // Laranja 400
  },
  green: {
    value: "green",
    name: "Verde",
    color: "#16a34a", // Verde 600
  },
  blue: {
    value: "blue",
    name: "Azul",
    color: "#2563eb", // Azul 600
  },
  brown: {
    value: "brown",
    name: "Marrom",
    color: "#78350f", // Marrom/Âmbar escuro 800
  },
  black: {
    value: "black",
    name: "Preta",
    color: "#1f2937", // Cinza escuro/Quase preto 800
  },
};

export const beltOptions: Belt[] = Object.keys(beltConfigs) as Belt[];
