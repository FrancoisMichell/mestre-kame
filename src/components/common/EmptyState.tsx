import type React from "react";
import Button from "./Button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

/**
 * Componente para exibir estados vazios de forma elegante
 * Usado quando não há dados para exibir (lista vazia, busca sem resultados, etc)
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center">
      {/* Ícone decorativo */}
      <div className="w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <div className="text-blue-400">{icon}</div>
      </div>

      {/* Título principal */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {/* Descrição detalhada */}
      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-md mb-4 md:mb-6 leading-relaxed">
        {description}
      </p>

      {/* Ações (botões) */}
      {(action || secondaryAction) && (
        <div className="flex gap-3 flex-wrap justify-center">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "primary"}
            >
              {action.icon}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || "ghost"}
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
