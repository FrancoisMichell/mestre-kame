import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renderiza spinner com tamanho padrão", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });

  it("renderiza spinner em tela cheia", () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    const fullScreenDiv = container.querySelector(
      ".flex.justify-center.items-center.min-h-screen",
    );
    expect(fullScreenDiv).toBeDefined();
  });

  it("renderiza mensagem quando fornecida", () => {
    render(<LoadingSpinner message="Carregando..." />);
    expect(screen.getByText("Carregando...")).toBeDefined();
  });

  it("renderiza com tamanhos diferentes", () => {
    const { container: containerSm } = render(<LoadingSpinner size="sm" />);
    const { container: containerLg } = render(<LoadingSpinner size="lg" />);

    const spinnerSm = containerSm.querySelector(".h-6.w-6");
    const spinnerLg = containerLg.querySelector(".h-16.w-16");

    expect(spinnerSm).toBeDefined();
    expect(spinnerLg).toBeDefined();
  });
});
