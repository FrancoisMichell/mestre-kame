import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StudentCardSkeleton } from "../StudentCardSkeleton";

describe("StudentCardSkeleton", () => {
  it("should render skeleton structure", () => {
    const { container } = render(<StudentCardSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should have card layout classes", () => {
    const { container } = render(<StudentCardSkeleton />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("shadow-sm");
  });

  it("should render avatar skeleton", () => {
    const { container } = render(<StudentCardSkeleton />);

    // Avatar skeleton should be a circle
    const avatarSkeleton = container.querySelector(".rounded-full");
    expect(avatarSkeleton).toBeInTheDocument();
  });

  it("should render multiple skeleton elements", () => {
    const { container } = render(<StudentCardSkeleton />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it("should have mobile responsive classes", () => {
    const { container } = render(<StudentCardSkeleton />);

    const mobileLayout = container.querySelector(".md\\:hidden");
    expect(mobileLayout).toBeInTheDocument();
  });

  it("should have desktop responsive classes", () => {
    const { container } = render(<StudentCardSkeleton />);

    const desktopLayout = container.querySelector(".hidden.md\\:block");
    expect(desktopLayout).toBeInTheDocument();
  });

  it("should render status badge skeleton", () => {
    const { container } = render(<StudentCardSkeleton />);

    const statusSkeleton = container.querySelector(".rounded-full.shrink-0");
    expect(statusSkeleton).toBeInTheDocument();
  });

  it("should match StudentCard layout structure", () => {
    const { container } = render(<StudentCardSkeleton />);
    const card = container.firstChild as HTMLElement;

    // Should have flex layout like StudentCard
    expect(card).toHaveClass("flex");
    expect(card).toHaveClass("items-center");
    expect(card).toHaveClass("gap-3");
  });
});
