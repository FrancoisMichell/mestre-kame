import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ClassEdit from "../ClassEdit";
import * as ClassContext from "../ClassContext";
import { apiClient } from "../../../api/client";
import type { Class } from "../ClassTypes";
import { createMockClassContext } from "../../../test-utils";

// Mock do Sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock do apiClient
vi.mock("../../../api/client");

// Mock do ClassContext
vi.mock("../ClassContext", async () => {
  const actual = await vi.importActual("../ClassContext");
  return {
    ...actual,
    useClasses: vi.fn(),
  };
});

const mockClass: Class = {
  id: "1",
  name: "Turma Avançada",
  days: [1, 3, 5], // Segunda, Quarta, Sexta
  startTime: "18:00",
  durationMinutes: 60,
  isActive: true,
  teacher: {
    id: "teacher-1",
    name: "Sensei Yamamoto",
    email: "yamamoto@mestrekame.com",
  },
};

const mockRefreshClasses = vi.fn();
const mockNavigate = vi.fn();

// Mock do useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderClassEdit = (classId = "1") => {
  return render(
    <MemoryRouter initialEntries={[`/turmas/${classId}/editar`]}>
      <Routes>
        <Route path="/turmas/:id/editar" element={<ClassEdit />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ClassEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockClassContext({
        classes: [mockClass],
        refreshClasses: mockRefreshClasses,
      }),
    );
  });

  it("should show loading skeleton while fetching class data", () => {
    vi.mocked(apiClient.get).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { container } = renderClassEdit();

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should load and display class data", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Turma Avançada")).toBeInTheDocument();
    expect(screen.getByDisplayValue("18:00")).toBeInTheDocument();

    // Verifica se o select tem o valor correto selecionado
    const durationSelect = screen.getByLabelText(
      /Duração/i,
    ) as HTMLSelectElement;
    expect(durationSelect.value).toBe("60");
  });

  it("should display error when class is not found", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(
      new Error("Class not found"),
    );

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Turma não encontrada")).toBeInTheDocument();
    });

    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("should update class name field", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Turma Avançada")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Nome da Turma/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Turma Iniciante");

    expect(screen.getByDisplayValue("Turma Iniciante")).toBeInTheDocument();
  });

  it("should toggle day selection", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    // Procura o botão "Ter" (Terça-feira) e clica nele
    const dayButtons = screen.getAllByRole("button");
    const terButton = dayButtons.find((btn) =>
      btn.textContent?.includes("Ter"),
    );

    expect(terButton).toBeInTheDocument();
    if (terButton) {
      await user.click(terButton);
      // Verifica que o botão mudou de estado
      expect(terButton).toHaveClass("bg-blue-600");
    }
  });

  it("should update start time", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("18:00")).toBeInTheDocument();
    });

    const timeInput = screen.getByLabelText(/Horário de Início/i);
    await user.clear(timeInput);
    await user.type(timeInput, "19:30");

    expect(screen.getByDisplayValue("19:30")).toBeInTheDocument();
  });

  it("should update duration", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const durationSelect = screen.getByLabelText(
      /Duração/i,
    ) as HTMLSelectElement;
    expect(durationSelect.value).toBe("60");

    await user.selectOptions(durationSelect, "90");

    expect(durationSelect.value).toBe("90");
  });

  it("should toggle active status", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const activeCheckbox = screen.getByLabelText("Turma ativa");
    expect(activeCheckbox).toBeChecked();

    await user.click(activeCheckbox);
    expect(activeCheckbox).not.toBeChecked();
  });

  it("should submit form and update class", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });
    vi.mocked(apiClient.put).mockResolvedValueOnce({
      data: { ...mockClass, name: "Turma Modificada" },
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Turma Avançada")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Nome da Turma/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Turma Modificada");

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith(
        "/classes/1",
        expect.objectContaining({
          name: "Turma Modificada",
        }),
      );
      expect(mockRefreshClasses).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/turmas");
    });
  });

  it("should show validation error for empty name", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Turma Avançada")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Nome da Turma/i);
    await user.clear(nameInput);

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Nome.*obrigatório/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when no days selected", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { ...mockClass, days: [1] }, // Apenas um dia selecionado
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    // Desmarca o único dia selecionado
    const dayButtons = screen.getAllByRole("button");
    const segButton = dayButtons.find((btn) =>
      btn.textContent?.includes("Seg"),
    );

    if (segButton) {
      await user.click(segButton);
    }

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Selecione pelo menos um dia da semana"),
      ).toBeInTheDocument();
    });
  });

  it("should open delete confirmation dialog", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Excluir");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
      expect(
        screen.getByText(/Tem certeza que deseja excluir a turma/i),
      ).toBeInTheDocument();
    });
  });

  it("should delete class when confirmed", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });
    vi.mocked(apiClient.delete).mockResolvedValueOnce({
      data: { message: "Turma excluída com sucesso" },
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Excluir");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
    });

    // Pega todos os botões com texto "Excluir" e clica no do diálogo (segundo)
    const deleteButtons = screen.getAllByText("Excluir");
    await user.click(deleteButtons[1]); // O segundo é do diálogo

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith("/classes/1");
      expect(mockRefreshClasses).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/turmas");
    });
  });

  it("should close delete dialog when cancelled", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Excluir");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
    });

    // Existem 2 botões "Cancelar": no formulário e no diálogo
    const cancelButtons = screen.getAllByText("Cancelar");
    await user.click(cancelButtons[1]); // O segundo é do diálogo

    await waitFor(() => {
      expect(screen.queryByText("Confirmar Exclusão")).not.toBeInTheDocument();
    });
  });

  it("should handle server error on update", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });
    vi.mocked(apiClient.put).mockRejectedValueOnce(new Error("Server error"));

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Turma Avançada")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("should navigate back when cancel button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockClass,
    });

    renderClassEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Turma")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancelar");
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/turmas");
  });
});
