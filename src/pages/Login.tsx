import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import type { LoginCredentials } from "../components/auth/AuthTypes";
import { useAuth } from "../components/auth/AuthContext";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const { login, isLoading, sessionExpiredMessage } = useAuth();
  const navigate = useNavigate();

  // A mensagem de erro exibida é sessionExpiredMessage ou erro local
  const displayError = sessionExpiredMessage || error;

  // Exibe toast quando sessão expirar
  useEffect(() => {
    if (sessionExpiredMessage) {
      toast.warning(sessionExpiredMessage);
    }
  }, [sessionExpiredMessage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // Limpar erro local quando o usuário começa a digitar
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials);
      navigate("/");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-wider mb-2">
            Mestre Kame
          </h1>
          <p className="text-gray-600">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            id="username"
            name="username"
            label="Matrícula"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Ex: 01AA123123"
            autoComplete="username"
            required
            className="mb-5"
          />

          <FormInput
            id="password"
            name="password"
            label="Senha"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="********"
            autoComplete="current-password"
            required
            className="mb-6"
          />

          {/* Error Message */}
          {displayError && (
            <ErrorMessage
              message={displayError}
              type={sessionExpiredMessage ? "warning" : "error"}
              className="mb-4"
            />
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Entrar
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a
            href="#recuperar-senha"
            className="text-sm text-blue-600 hover:text-blue-700 transition duration-150"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
