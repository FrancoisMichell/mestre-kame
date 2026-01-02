import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "../Skeleton";

describe("Skeleton", () => {
  it("should render with default props", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse");
    expect(skeleton).toHaveClass("bg-gray-200");
    expect(skeleton).toHaveClass("rounded");
    expect(skeleton).toHaveClass("h-4");
  });

  it("should render text variant", () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass("rounded");
    expect(skeleton).toHaveClass("h-4");
  });

  it("should render circle variant", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass("rounded-full");
  });

  it("should render rectangle variant", () => {
    const { container } = render(<Skeleton variant="rectangle" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass("rounded");
  });

  it("should apply custom width as number", () => {
    const { container } = render(<Skeleton width={200} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ width: "200px" });
  });

  it("should apply custom width as string", () => {
    const { container } = render(<Skeleton width="50%" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ width: "50%" });
  });

  it("should apply custom height as number", () => {
    const { container } = render(<Skeleton height={100} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ height: "100px" });
  });

  it("should apply custom height as string", () => {
    const { container } = render(<Skeleton height="2rem" />);
    const skeleton = container.firstChild as HTMLElement;

    // Browser converts rem to px, so check that height is set
    expect(skeleton.style.height).toBeTruthy();
  });

  it("should apply custom className", () => {
    const { container } = render(<Skeleton className="my-custom-class" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass("my-custom-class");
  });

  it("should have aria-hidden attribute", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("should apply both width and height together", () => {
    const { container } = render(<Skeleton width={150} height={80} />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveStyle({ width: "150px", height: "80px" });
  });

  it("should combine variant, size and className", () => {
    const { container } = render(
      <Skeleton variant="circle" width={50} height={50} className="mx-auto" />,
    );
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).toHaveClass("mx-auto");
    expect(skeleton).toHaveStyle({ width: "50px", height: "50px" });
  });
});
