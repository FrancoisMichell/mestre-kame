import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Confirmar Ação",
    message: "Tem certeza que deseja continuar?",
  };

  it("should render with default props", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("Confirmar Ação")).toBeInTheDocument();
    expect(
      screen.getByText("Tem certeza que deseja continuar?"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar" }),
    ).toBeInTheDocument();
  });

  it("should render with custom button texts", () => {
    render(
      <ConfirmDialog {...defaultProps} confirmText="Sim" cancelText="Não" />,
    );

    expect(screen.getByRole("button", { name: "Não" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sim" })).toBeInTheDocument();
  });

  it("should call onClose when clicking cancel button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm and onClose when clicking confirm button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        {...defaultProps}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle async onConfirm", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <ConfirmDialog
        {...defaultProps}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should disable buttons during loading", async () => {
    const user = userEvent.setup();
    const onConfirm = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });

    await user.click(confirmButton);

    // Buttons should be disabled during loading
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it("should render danger variant icon by default", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const icon = screen.getByRole("dialog").querySelector(".text-red-600");
    expect(icon).toBeInTheDocument();
  });

  it("should render warning variant icon", () => {
    render(<ConfirmDialog {...defaultProps} variant="warning" />);

    const icon = screen.getByRole("dialog").querySelector(".text-yellow-600");
    expect(icon).toBeInTheDocument();
  });

  it("should not close on overlay click when loading", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    let resolveConfirm: () => void;
    const onConfirm = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve;
        }),
    );
    render(
      <ConfirmDialog
        {...defaultProps}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    await user.click(confirmButton);

    // Try to click overlay while loading
    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);

    // onClose should not be called during loading
    expect(onClose).not.toHaveBeenCalled();

    // Resolve the confirmation
    resolveConfirm!();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should not render when isOpen is false", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should show loading state on confirm button", async () => {
    const user = userEvent.setup();
    const onConfirm = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    await user.click(confirmButton);

    // Button should show loading state
    expect(confirmButton).toBeDisabled();

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
