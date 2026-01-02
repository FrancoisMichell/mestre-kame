import type React from "react";

interface ErrorMessageProps {
  message: string;
  title?: string;
  type?: "error" | "warning" | "info" | "success";
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  type = "error",
  className = "",
}) => {
  const typeConfig = {
    error: {
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
      textColor: "text-red-700",
      titleColor: "text-red-800",
    },
    warning: {
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      titleColor: "text-yellow-900",
    },
    info: {
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
      titleColor: "text-blue-800",
    },
    success: {
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      titleColor: "text-green-800",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} ${config.textColor} px-4 py-3 rounded ${className}`}
    >
      {title && (
        <p className={`font-bold ${config.titleColor} mb-1`}>{title}</p>
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
