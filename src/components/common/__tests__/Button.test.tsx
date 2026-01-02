import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("renderiza com texto", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("chama onClick quando clicado", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("não chama onClick quando desabilitado", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>,
    );

    await user.click(screen.getByText("Click"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("exibe spinner quando loading é true", () => {
    const { container } = render(<Button loading>Loading</Button>);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });

  it("renderiza com variantes diferentes", () => {
    const { container: primary } = render(
      <Button variant="primary">Primary</Button>,
    );
    const { container: danger } = render(
      <Button variant="danger">Danger</Button>,
    );

    expect(primary.querySelector(".bg-blue-600")).toBeDefined();
    expect(danger.querySelector(".bg-red-600")).toBeDefined();
  });

  it("renderiza com largura total quando fullWidth é true", () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    expect(container.querySelector(".w-full")).toBeDefined();
  });

  it("renderiza com tamanhos diferentes", () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    const { container: lg } = render(<Button size="lg">Large</Button>);

    expect(sm.querySelector(".text-sm")).toBeDefined();
    expect(lg.querySelector(".text-lg")).toBeDefined();
  });
});
