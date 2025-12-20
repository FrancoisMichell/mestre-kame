import type { Belt } from "./StudentTypes";

export const beltOptions: Belt[] = [
  "White",
  "Yellow",
  "Orange",
  "Green",
  "Blue",
  "Brown",
  "Black",
];

const beltColorMap: Record<Belt, string> = {
  White: "#e5e7eb", // Cinza claro (quase branco, para contraste)
  Yellow: "#facc15", // Amarelo 500
  Orange: "#fb923c", // Laranja 400
  Green: "#16a34a", // Verde 600
  Blue: "#2563eb", // Azul 600
  Brown: "#78350f", // Marrom/Âmbar escuro 800
  Black: "#1f2937", // Cinza escuro/Quase preto 800
};

export const getBeltColor = (belt: Belt): string => {
  return beltColorMap[belt] || beltColorMap["White"];
};

const beltNameMap: Record<Belt, string> = {
  White: "Branca",
  Yellow: "Amarela",
  Orange: "Laranja",
  Green: "Verde",
  Blue: "Azul",
  Brown: "Marrom",
  Black: "Preta",
};

export const getBeltName = (belt: Belt): string => {
  return beltNameMap[belt] || beltNameMap["White"];
};
