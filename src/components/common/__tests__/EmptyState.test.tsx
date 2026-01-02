import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import EmptyState from "../EmptyState";

describe("EmptyState", () => {
  const mockIcon = (
    <svg data-testid="mock-icon">
      <circle />
    </svg>
  );

  it("should render title and description", () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="No data found"
        description="There is nothing to display here"
      />,
    );

    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(
      screen.getByText("There is nothing to display here"),
    ).toBeInTheDocument();
  });

  it("should render icon", () => {
    render(
      <EmptyState icon={mockIcon} title="Empty" description="No content" />,
    );

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("should render primary action button", () => {
    const handleClick = vi.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        action={{
          label: "Add Item",
          onClick: handleClick,
        }}
      />,
    );

    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("should call action onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        action={{
          label: "Add Item",
          onClick: handleClick,
        }}
      />,
    );

    const button = screen.getByText("Add Item");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render action with icon", () => {
    const actionIcon = <span data-testid="action-icon">+</span>;

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        action={{
          label: "Add",
          onClick: vi.fn(),
          icon: actionIcon,
        }}
      />,
    );

    expect(screen.getByTestId("action-icon")).toBeInTheDocument();
  });

  it("should render with custom button variant", () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        action={{
          label: "Delete",
          onClick: vi.fn(),
          variant: "danger",
        }}
      />,
    );

    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-red-600");
  });

  it("should render secondary action", () => {
    const handlePrimary = vi.fn();
    const handleSecondary = vi.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        action={{
          label: "Primary",
          onClick: handlePrimary,
        }}
        secondaryAction={{
          label: "Secondary",
          onClick: handleSecondary,
        }}
      />,
    );

    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("should call secondaryAction onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleSecondary = vi.fn();

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        secondaryAction={{
          label: "Cancel",
          onClick: handleSecondary,
        }}
      />,
    );

    const button = screen.getByText("Cancel");
    await user.click(button);

    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it("should not render actions if none provided", () => {
    render(
      <EmptyState icon={mockIcon} title="Empty" description="No content" />,
    );

    // Não deve haver botões
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render only secondary action without primary", () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description="No content"
        secondaryAction={{
          label: "Back",
          onClick: vi.fn(),
        }}
      />,
    );

    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("should render multiline description", () => {
    const longDescription =
      "This is a very long description that spans multiple lines and provides detailed information about the empty state";

    render(
      <EmptyState
        icon={mockIcon}
        title="Empty"
        description={longDescription}
      />,
    );

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it("should apply correct styling classes", () => {
    const { container } = render(
      <EmptyState icon={mockIcon} title="Empty" description="No content" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "flex-col", "items-center");
    expect(wrapper).toHaveClass("py-12"); // mobile
    expect(wrapper).toHaveClass("md:py-16"); // desktop
  });
});
