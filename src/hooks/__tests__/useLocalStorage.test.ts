import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [value] = result.current;
    expect(value).toBe("initialValue");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [value] = result.current;
    expect(value).toBe("storedValue");
  });

  it("should update localStorage when setValue is called", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [, setValue] = result.current;

    act(() => {
      setValue("newValue");
    });

    const [value] = result.current;
    expect(value).toBe("newValue");
    expect(localStorage.getItem("testKey")).toBe(JSON.stringify("newValue"));
  });

  it("should remove value from localStorage when removeValue is called", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [, , removeValue] = result.current;

    act(() => {
      removeValue();
    });

    const [value] = result.current;
    expect(value).toBe("initialValue");
    expect(localStorage.getItem("testKey")).toBeNull();
  });

  it("should work with different data types", () => {
    // Objeto
    const { result: objResult } = renderHook(() =>
      useLocalStorage("objKey", { name: "John", age: 30 }),
    );

    const [, setObjValue] = objResult.current;

    act(() => {
      setObjValue({ name: "Jane", age: 25 });
    });

    const [objValue] = objResult.current;
    expect(objValue).toEqual({ name: "Jane", age: 25 });

    // Array
    const { result: arrResult } = renderHook(() =>
      useLocalStorage("arrKey", [1, 2, 3]),
    );

    const [, setArrValue] = arrResult.current;

    act(() => {
      setArrValue([4, 5, 6]);
    });

    const [arrValue] = arrResult.current;
    expect(arrValue).toEqual([4, 5, 6]);

    // Número
    const { result: numResult } = renderHook(() =>
      useLocalStorage("numKey", 42),
    );

    const [, setNumValue] = numResult.current;

    act(() => {
      setNumValue(100);
    });

    const [numValue] = numResult.current;
    expect(numValue).toBe(100);

    // Booleano
    const { result: boolResult } = renderHook(() =>
      useLocalStorage("boolKey", false),
    );

    const [, setBoolValue] = boolResult.current;

    act(() => {
      setBoolValue(true);
    });

    const [boolValue] = boolResult.current;
    expect(boolValue).toBe(true);
  });

  it("should handle corrupted localStorage data", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    localStorage.setItem("testKey", "invalid-json{");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [value] = result.current;
    expect(value).toBe("initialValue");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading localStorage key "testKey"'),
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should sync with storage events from other tabs", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    const [initialValue] = result.current;
    expect(initialValue).toBe("initialValue");

    // Simula mudança em outra aba
    act(() => {
      const event = new StorageEvent("storage", {
        key: "testKey",
        newValue: JSON.stringify("valueFromOtherTab"),
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });

    const [value] = result.current;
    expect(value).toBe("valueFromOtherTab");
  });

  it("should not sync with storage events for different keys", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "otherKey",
        newValue: JSON.stringify("otherValue"),
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });

    const [value] = result.current;
    expect(value).toBe("initialValue");
  });

  it("should cleanup storage event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useLocalStorage("testKey", "initialValue"),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "storage",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});
