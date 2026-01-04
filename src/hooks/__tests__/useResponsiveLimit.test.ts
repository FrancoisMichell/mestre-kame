import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useResponsiveLimit } from "../useResponsiveLimit";

describe("useResponsiveLimit", () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it("should return 6 for mobile screens (< 640px)", () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useResponsiveLimit());
    expect(result.current).toBe(6);
  });

  it("should return 9 for tablet screens (640px - 1023px)", () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useResponsiveLimit());
    expect(result.current).toBe(9);
  });

  it("should return 12 for desktop screens (1024px - 1279px)", () => {
    setWindowWidth(1200);
    const { result } = renderHook(() => useResponsiveLimit());
    expect(result.current).toBe(12);
  });

  it("should return 18 for large desktop screens (>= 1280px)", () => {
    setWindowWidth(1920);
    const { result } = renderHook(() => useResponsiveLimit());
    expect(result.current).toBe(18);
  });

  it("should update limit when window is resized", () => {
    setWindowWidth(375); // Mobile
    const { result } = renderHook(() => useResponsiveLimit());
    expect(result.current).toBe(6);

    act(() => {
      setWindowWidth(1920); // Large Desktop
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(18);
  });

  it("should handle edge cases at breakpoints", () => {
    // Exatamente no breakpoint de 640px (tablet)
    setWindowWidth(640);
    const { result: result1 } = renderHook(() => useResponsiveLimit());
    expect(result1.current).toBe(9);

    // Exatamente no breakpoint de 1024px (desktop)
    setWindowWidth(1024);
    const { result: result2 } = renderHook(() => useResponsiveLimit());
    expect(result2.current).toBe(12);

    // Exatamente no breakpoint de 1280px (large desktop)
    setWindowWidth(1280);
    const { result: result3 } = renderHook(() => useResponsiveLimit());
    expect(result3.current).toBe(18);
  });

  it("should cleanup resize listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useResponsiveLimit());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
