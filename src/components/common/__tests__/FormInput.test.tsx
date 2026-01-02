import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../FormInput";

describe("FormInput", () => {
  it("renderiza input com label", () => {
    render(
      <FormInput
        id="test"
        name="test"
        label="Test Label"
        value=""
        onChange={() => {}}
      />,
    );

    expect(screen.getByLabelText("Test Label")).toBeDefined();
  });

  it("exibe asterisco quando required é true", () => {
    render(
      <FormInput
        id="test"
        name="test"
        label="Required Field"
        value=""
        onChange={() => {}}
        required
      />,
    );

    expect(screen.getByText("*")).toBeDefined();
  });

  it("chama onChange quando valor é alterado", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FormInput
        id="test"
        name="test"
        label="Test"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByLabelText("Test");
    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalled();
  });

  it("renderiza com placeholder", () => {
    render(
      <FormInput
        id="test"
        name="test"
        label="Test"
        value=""
        onChange={() => {}}
        placeholder="Enter text"
      />,
    );

    expect(screen.getByPlaceholderText("Enter text")).toBeDefined();
  });

  it("fica desabilitado quando disabled é true", () => {
    render(
      <FormInput
        id="test"
        name="test"
        label="Test"
        value=""
        onChange={() => {}}
        disabled
      />,
    );

    const input = screen.getByLabelText("Test") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
