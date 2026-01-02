import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Modal",
    children: <div>Modal content</div>,
  };

  it("should not render when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should render footer when provided", () => {
    render(<Modal {...defaultProps} footer={<button>Footer Button</button>} />);
    expect(screen.getByText("Footer Button")).toBeInTheDocument();
  });

  it("should call onClose when clicking close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByLabelText("Fechar modal");
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking overlay", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when clicking overlay if closeOnOverlayClick is false", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />,
    );

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should not call onClose when clicking modal content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    const modalContent = screen.getByText("Modal content");
    await user.click(modalContent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when pressing Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when pressing other keys", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);

    await user.keyboard("{Enter}");
    await user.keyboard("{Space}");

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should set body overflow to hidden when open", () => {
    render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore body overflow when closed", () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("unset");
  });

  it("should have correct accessibility attributes", () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });

  it("should render close button with X icon", () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByLabelText("Fechar modal");

    expect(closeButton).toBeInTheDocument();
    expect(closeButton.querySelector("svg")).toBeInTheDocument();
  });
});
