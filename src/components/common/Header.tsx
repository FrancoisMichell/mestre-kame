import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useToggle } from "../../hooks/useToggle";

const Header = () => {
  const [isMobileMenuOpen, toggleMenu, , closeMobileMenu] = useToggle(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nome da esquerda  */}
        <div className="shrink-0">
          <a
            href="/"
            className="text-2xl font-extrabold text-blue-600 tracking-wider"
          >
            Mestre Kame
          </a>
        </div>

        {/* Navegação de links  */}
        <nav className="hidden md:block">
          <div className="flex items-baseline space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Alunos
            </Link>
            <Link
              to="/turmas"
              className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Turmas
            </Link>
            <Link
              to="/cadastro"
              className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Cadastro
            </Link>
            <a
              href="#config"
              className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Configurações
            </a>
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 text-sm font-medium max-w-[150px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* BOTÃO MOBILE */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Alunos
          </Link>
          <Link
            to="/turmas"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Turmas
          </Link>
          <Link
            to="/cadastro"
            onClick={closeMobileMenu}
            className="block text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Cadastro
          </Link>
          <a
            href="#config"
            className="block text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Configurações
          </a>
          {user && (
            <>
              <div className="px-3 py-2 text-gray-700 text-sm font-medium border-t border-gray-200 mt-2">
                {user.name}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="block w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
