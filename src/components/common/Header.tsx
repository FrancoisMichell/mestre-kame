import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
              Lista de Alunos
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
          </div>
        </nav>

        {/* BOTÃO MOBILE */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700p-2 rounded-md"
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
            onClick={toggleMenu}
            className="block text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Lista de Alunos
          </Link>
          <Link
            to="/cadastro"
            onClick={toggleMenu}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
