import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renderiza mensagem de erro", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("renderiza título quando fornecido", () => {
    render(<ErrorMessage title="Error" message="Details here" />);
    expect(screen.getByText("Error")).toBeDefined();
    expect(screen.getByText("Details here")).toBeDefined();
  });

  it("renderiza com tipo error por padrão", () => {
    const { container } = render(<ErrorMessage message="Error" />);
    expect(container.querySelector(".bg-red-100")).toBeDefined();
  });

  it("renderiza com tipo warning", () => {
    const { container } = render(
      <ErrorMessage message="Warning" type="warning" />,
    );
    expect(container.querySelector(".bg-yellow-100")).toBeDefined();
  });

  it("renderiza com tipo success", () => {
    const { container } = render(
      <ErrorMessage message="Success" type="success" />,
    );
    expect(container.querySelector(".bg-green-100")).toBeDefined();
  });

  it("renderiza com tipo info", () => {
    const { container } = render(<ErrorMessage message="Info" type="info" />);
    expect(container.querySelector(".bg-blue-100")).toBeDefined();
  });
});
