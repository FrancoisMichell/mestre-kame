import React, { Component, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import { logError } from "../../utils/errorHandler";
import { ERROR_MESSAGES } from "../../constants/messages";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary para capturar erros React não tratados
 * Previne que toda a aplicação quebre por causa de um erro
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Loga o erro
    logError(
      {
        message: error.message,
        code: "REACT_ERROR",
        details: {
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        },
      },
      "ErrorBoundary",
    );

    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Se foi fornecido um fallback customizado, usa ele
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Algo deu errado
              </h1>
              <p className="text-gray-600">{ERROR_MESSAGES.GENERIC}</p>
            </div>

            <ErrorMessage
              type="error"
              title="Detalhes do erro"
              message={this.state.error?.message || ERROR_MESSAGES.UNKNOWN}
              className="mb-6"
            />

            {/* Detalhes técnicos apenas em desenvolvimento */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-6 p-4 bg-gray-100 rounded-lg text-xs">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Stack trace (desenvolvimento)
                </summary>
                <pre className="overflow-auto text-gray-600 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </pre>
                <pre className="overflow-auto text-gray-600 whitespace-pre-wrap mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <Button onClick={this.handleReset} variant="primary" fullWidth>
                Tentar novamente
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="secondary"
                fullWidth
              >
                Ir para início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
