import type { Belt } from "./StudentTypes";

const beltColorMap: Record<Belt, string> = {
  'branca': '#e5e7eb', // Cinza claro (quase branco, para contraste)
  'amarela': '#facc15', // Amarelo 500
  'laranja': '#fb923c', // Laranja 400
  'verde': '#16a34a', // Verde 600
  'azul': '#2563eb', // Azul 600
  'marrom': '#78350f', // Marrom/Âmbar escuro 800
  'preta': '#1f2937', // Cinza escuro/Quase preto 800
};

export const getBeltColor = (belt: Belt): string => {
  return beltColorMap[belt] || beltColorMap['branca'];
};