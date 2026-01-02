import type React from "react";

export interface SkeletonProps {
  variant?: "text" | "circle" | "rectangle";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className = "",
}) => {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "rounded h-4",
    circle: "rounded-full",
    rectangle: "rounded",
  };

  const style: React.CSSProperties = {
    width: width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined,
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
