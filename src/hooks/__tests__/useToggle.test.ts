import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToggle } from "../useToggle";

describe("useToggle", () => {
  it("should initialize with default value false", () => {
    const { result } = renderHook(() => useToggle());

    const [value] = result.current;
    expect(value).toBe(false);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useToggle(true));

    const [value] = result.current;
    expect(value).toBe(true);
  });

  it("should toggle value from false to true", () => {
    const { result } = renderHook(() => useToggle(false));

    const [initialValue, toggle] = result.current;
    expect(initialValue).toBe(false);

    act(() => {
      toggle();
    });

    const [newValue] = result.current;
    expect(newValue).toBe(true);
  });

  it("should toggle value from true to false", () => {
    const { result } = renderHook(() => useToggle(true));

    const [initialValue, toggle] = result.current;
    expect(initialValue).toBe(true);

    act(() => {
      toggle();
    });

    const [newValue] = result.current;
    expect(newValue).toBe(false);
  });

  it("should toggle value multiple times", () => {
    const { result } = renderHook(() => useToggle(false));

    const [, toggle] = result.current;

    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(true);
  });

  it("should set value to true with setTrue", () => {
    const { result } = renderHook(() => useToggle(false));

    const [, , setTrue] = result.current;

    act(() => {
      setTrue();
    });

    const [value] = result.current;
    expect(value).toBe(true);
  });

  it("should keep value true when setTrue is called multiple times", () => {
    const { result } = renderHook(() => useToggle(false));

    const [, , setTrue] = result.current;

    act(() => {
      setTrue();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      setTrue();
    });
    expect(result.current[0]).toBe(true);
  });

  it("should set value to false with setFalse", () => {
    const { result } = renderHook(() => useToggle(true));

    const [, , , setFalse] = result.current;

    act(() => {
      setFalse();
    });

    const [value] = result.current;
    expect(value).toBe(false);
  });

  it("should keep value false when setFalse is called multiple times", () => {
    const { result } = renderHook(() => useToggle(true));

    const [, , , setFalse] = result.current;

    act(() => {
      setFalse();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      setFalse();
    });
    expect(result.current[0]).toBe(false);
  });

  it("should work with all functions together", () => {
    const { result } = renderHook(() => useToggle(false));

    const [, toggle, setTrue, setFalse] = result.current;

    act(() => {
      setTrue();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      setFalse();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      setTrue();
    });
    expect(result.current[0]).toBe(true);
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => useToggle());

    const [, toggle1, setTrue1, setFalse1] = result.current;

    rerender();

    const [, toggle2, setTrue2, setFalse2] = result.current;

    // Funções devem manter a mesma referência
    expect(toggle1).toBe(toggle2);
    expect(setTrue1).toBe(setTrue2);
    expect(setFalse1).toBe(setFalse2);
  });

  it("should work as modal controller", () => {
    const { result } = renderHook(() => useToggle());

    const [isOpen, toggle, open, close] = result.current;

    expect(isOpen).toBe(false);

    // Abre modal
    act(() => {
      open();
    });
    expect(result.current[0]).toBe(true);

    // Fecha modal
    act(() => {
      close();
    });
    expect(result.current[0]).toBe(false);

    // Toggle modal
    act(() => {
      toggle();
    });
    expect(result.current[0]).toBe(true);
  });
});
