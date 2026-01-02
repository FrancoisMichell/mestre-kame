import type React from "react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "date" | "password" | "email" | "number";
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default FormInput;
