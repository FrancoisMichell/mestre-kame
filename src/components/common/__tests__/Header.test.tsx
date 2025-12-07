import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Header from "../Header";

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
  );
};

describe("Header", () => {
  it("should render brand name", () => {
    renderHeader();
    expect(screen.getByText("Mestre Kame")).toBeInTheDocument();
  });

  it("should render desktop navigation links", () => {
    renderHeader();
    const desktopLinks = screen.getAllByRole("link");

    // Find "Lista de Alunos" link
    const listaLink = desktopLinks.find(
      (link) => link.textContent === "Lista de Alunos",
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

  it("should not show mobile menu by default", () => {
    const { container } = renderHeader();
    // Find the mobile menu container div (has both block/hidden and md:hidden classes)
    const mobileMenuContainer = container.querySelector(
      "div.md\\:hidden.hidden",
    );
    expect(mobileMenuContainer).toBeInTheDocument();
    expect(mobileMenuContainer).toHaveClass("hidden");
  });

  it("should toggle mobile menu when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderHeader();

    // Find hamburger button
    const hamburgerButton = screen.getByRole("button");

    // Mobile menu should be hidden initially
    let mobileMenuContainer = container.querySelector("div.md\\:hidden.hidden");
    expect(mobileMenuContainer).toBeInTheDocument();

    // Click to open
    await user.click(hamburgerButton);
    mobileMenuContainer = container.querySelector("div.md\\:hidden.block");
    expect(mobileMenuContainer).toBeInTheDocument();

    // Click to close
    await user.click(hamburgerButton);
    mobileMenuContainer = container.querySelector("div.md\\:hidden.hidden");
    expect(mobileMenuContainer).toBeInTheDocument();
  });

  it("should render mobile menu links", async () => {
    const user = userEvent.setup();
    renderHeader();

    // Open mobile menu
    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    // Check mobile menu links (there will be duplicates for desktop + mobile)
    const allLinks = screen.getAllByRole("link");

    // Should have 7 links total (1 brand + 3 desktop + 3 mobile)
    expect(allLinks).toHaveLength(7);

    // Verify mobile and desktop have "Lista de Alunos"
    const listaLinks = allLinks.filter(
      (link) => link.textContent === "Lista de Alunos",
    );
    expect(listaLinks).toHaveLength(2); // Desktop + Mobile

    // Both desktop and mobile have "Cadastro"
    const cadastroLinks = allLinks.filter(
      (link) => link.textContent === "Cadastro",
    );
    expect(cadastroLinks).toHaveLength(2); // Desktop + Mobile

    // Both desktop and mobile have "Configurações"
    const configLinks = allLinks.filter(
      (link) => link.textContent === "Configurações",
    );
    expect(configLinks).toHaveLength(2);
  });

  it("should close mobile menu when a mobile link is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderHeader();

    // Open mobile menu
    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    let mobileMenuContainer = container.querySelector("div.md\\:hidden.block");
    expect(mobileMenuContainer).toBeInTheDocument();

    // Click a mobile "Lista de Alunos" link
    const allListaLinks = screen.getAllByText("Lista de Alunos");
    await user.click(allListaLinks[1]); // Second one is the mobile link

    // Menu should close
    mobileMenuContainer = container.querySelector("div.md\\:hidden.hidden");
    expect(mobileMenuContainer).toBeInTheDocument();
  });

  it("should render hamburger icon", () => {
    renderHeader();
    const hamburgerButton = screen.getByRole("button");
    const svg = hamburgerButton.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("h-6", "w-6");
  });
});
