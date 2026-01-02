import { useState, useCallback } from "react";

/**
 * Hook para gerenciar estados booleanos (toggle)
 * Simplifica lógica de abrir/fechar modais, menus, etc.
 *
 * @param initialValue - Valor inicial (padrão: false)
 * @returns [value, toggle, setTrue, setFalse]
 *
 * @example
 * const [isOpen, toggle, open, close] = useToggle();
 * <button onClick={toggle}>Toggle Menu</button>
 * <button onClick={open}>Abrir</button>
 * <button onClick={close}>Fechar</button>
 */
export function useToggle(
  initialValue: boolean = false,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}
