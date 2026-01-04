import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    expect(result.current).toBe("initial");

    // Muda o valor
    rerender({ value: "changed", delay: 500 });

    // Valor ainda não deve ter mudado imediatamente
    expect(result.current).toBe("initial");

    // Após o delay, o valor deve ter mudado
    await waitFor(
      () => {
        expect(result.current).toBe("changed");
      },
      { timeout: 600 },
    );
  });

  it("should cancel previous timer on rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "initial" },
      },
    );

    expect(result.current).toBe("initial");

    // Múltiplas mudanças rápidas
    rerender({ value: "change1" });
    await new Promise((resolve) => setTimeout(resolve, 100));

    rerender({ value: "change2" });
    await new Promise((resolve) => setTimeout(resolve, 100));

    rerender({ value: "final" });

    // Ainda deve estar no valor inicial
    expect(result.current).toBe("initial");

    // Após o delay completo da última mudança, deve ser "final"
    await waitFor(
      () => {
        expect(result.current).toBe("final");
      },
      { timeout: 400 },
    );
  });

  it("should work with different data types", async () => {
    // Testa com número
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: 0 },
      },
    );

    numberRerender({ value: 42 });

    await waitFor(
      () => {
        expect(numberResult.current).toBe(42);
      },
      { timeout: 300 },
    );

    // Testa com objeto
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      {
        initialProps: { value: { name: "John" } },
      },
    );

    objectRerender({ value: { name: "Jane" } });

    await waitFor(
      () => {
        expect(objectResult.current).toEqual({ name: "Jane" });
      },
      { timeout: 600 },
    );
  });

  it("should use default delay of 500ms", async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "changed" });

    // Antes de 500ms
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(result.current).toBe("initial");

    // Após 500ms
    await waitFor(
      () => {
        expect(result.current).toBe("changed");
      },
      { timeout: 200 },
    );
  });

  it("should cleanup timer on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("should handle delay changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 200 },
      },
    );

    rerender({ value: "changed", delay: 200 });

    await waitFor(
      () => {
        expect(result.current).toBe("changed");
      },
      { timeout: 300 },
    );

    // Muda o delay
    rerender({ value: "another", delay: 1000 });

    // Valor ainda não deve ter mudado após 500ms
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(result.current).toBe("changed");

    // Deve mudar após 1000ms total
    await waitFor(
      () => {
        expect(result.current).toBe("another");
      },
      { timeout: 600 },
    );
  });
});
