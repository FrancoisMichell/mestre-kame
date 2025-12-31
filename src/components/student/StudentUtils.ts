import type { Belt } from "./StudentTypes";

export const beltOptions: Belt[] = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "brown",
  "black",
];

const beltColorMap: Record<Belt, string> = {
  white: "#e5e7eb", // Cinza claro (quase branco, para contraste)
  yellow: "#facc15", // Amarelo 500
  orange: "#fb923c", // Laranja 400
  green: "#16a34a", // Verde 600
  blue: "#2563eb", // Azul 600
  brown: "#78350f", // Marrom/Âmbar escuro 800
  black: "#1f2937", // Cinza escuro/Quase preto 800
};

export const getBeltColor = (belt: Belt): string => {
  return beltColorMap[belt] || beltColorMap["white"];
};

const beltNameMap: Record<Belt, string> = {
  white: "Branca",
  yellow: "Amarela",
  orange: "Laranja",
  green: "Verde",
  blue: "Azul",
  brown: "Marrom",
  black: "Preta",
};

export const getBeltName = (belt: Belt): string => {
  return beltNameMap[belt] || beltNameMap["white"];
};
