import { useState, useEffect, useCallback } from "react";

/**
 * Hook para gerenciar valores no localStorage de forma reativa
 * Sincroniza automaticamente o estado com localStorage
 *
 * @param key - Chave no localStorage
 * @param initialValue - Valor inicial se não houver valor no localStorage
 * @returns [valor, setValue, removeValue]
 *
 * @example
 * const [token, setToken, removeToken] = useLocalStorage("authToken", "");
 * setToken("novo-token"); // Salva no localStorage e atualiza estado
 * removeToken(); // Remove do localStorage e atualiza estado
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] {
  // State para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  // Função para remover o valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincroniza com mudanças no localStorage (de outras abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
