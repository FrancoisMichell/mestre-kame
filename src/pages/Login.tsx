import { useState, type ChangeEvent, type FormEvent } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import type { LoginCredentials } from "../components/auth/AuthTypes";
import { useAuth } from "../components/auth/AuthContext";

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
      setError(
        error.response?.data?.message ||
          "Erro ao fazer login. Tente novamente.",
      );
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
          {/* Matrícula Input */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matrícula
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
              placeholder="Ex: 01AA123123"
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {displayError && (
            <div
              className={`mb-4 border px-4 py-3 rounded ${
                sessionExpiredMessage
                  ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              <p className="text-sm">{displayError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              "Entrar"
            )}
          </button>
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
