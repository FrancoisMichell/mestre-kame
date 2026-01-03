import { useState, useEffect } from "react";

/**
 * Hook que retorna um limite responsivo baseado no tamanho da tela
 * - Mobile (< 640px): 6 itens
 * - Tablet (640px - 1023px): 9 itens
 * - Desktop (1024px - 1279px): 12 itens
 * - Large Desktop (>= 1280px): 18 itens
 */
export const useResponsiveLimit = (): number => {
  const getResponsiveLimit = () => {
    if (typeof window === "undefined") return 12; // SSR fallback

    const width = window.innerWidth;

    if (width < 640) return 6; // Mobile
    if (width < 1024) return 9; // Tablet
    if (width < 1280) return 12; // Desktop
    return 18; // Large Desktop
  };

  const [limit, setLimit] = useState(getResponsiveLimit);

  useEffect(() => {
    const handleResize = () => {
      setLimit(getResponsiveLimit());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return limit;
};
