import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Header from "../Header";
import { AuthProvider } from "../../auth/AuthContext";

// Mock do apiClient
vi.mock("../../../api/client");

const renderHeader = (authenticated = false) => {
  if (authenticated) {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };
    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render brand name", () => {
    renderHeader();
    expect(screen.getByText("Mestre Kame")).toBeInTheDocument();
  });

  it("should render desktop navigation links", () => {
    renderHeader();
    const desktopLinks = screen.getAllByRole("link");

    // Find "Alunos" link
    const listaLink = desktopLinks.find(
      (link) => link.textContent === "Alunos",
    );
    expect(listaLink).toBeInTheDocument();
    expect(listaLink).toHaveAttribute("href", "/");

    // Find "Cadastro" link
    const cadastroLink = desktopLinks.find(
      (link) => link.textContent === "Cadastro",
    );
    expect(cadastroLink).toBeInTheDocument();
    expect(cadastroLink).toHaveAttribute("href", "/cadastro");

    // Find "Configurações" link
    const configLink = desktopLinks.find(
      (link) => link.textContent === "Configurações",
    );
    expect(configLink).toBeInTheDocument();
    expect(configLink).toHaveAttribute("href", "#config");
  });

  it("should display user name when authenticated", async () => {
    renderHeader(true);

    const userNames = await screen.findAllByText("João Silva");
    expect(userNames.length).toBeGreaterThan(0);
  });

  it("should display logout button when authenticated", async () => {
    renderHeader(true);

    const logoutButtons = await screen.findAllByText("Sair");
    expect(logoutButtons.length).toBeGreaterThan(0);
  });

  it("should not display user info when not authenticated", async () => {
    renderHeader(false);

    // Aguarda o AuthProvider resolver
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sair" }),
    ).not.toBeInTheDocument();
  });
});
