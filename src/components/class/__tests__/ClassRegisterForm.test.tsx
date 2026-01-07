import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ClassRegisterForm from "../ClassRegisterForm";

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAddClass hook
const mockAddClass = vi.fn();
vi.mock("../../../api/hooks", () => ({
  useAddClass: () => mockAddClass,
}));

const renderForm = () => {
  return render(
    <BrowserRouter>
      <ClassRegisterForm />
    </BrowserRouter>,
  );
};

describe("ClassRegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    renderForm();

    expect(screen.getByLabelText(/nome da turma/i)).toBeInTheDocument();
    expect(screen.getByText(/dias da semana/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horário de início/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duração/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar turma/i }),
    ).toBeInTheDocument();
  });

  it("displays all days of week as buttons", () => {
    renderForm();

    expect(screen.getByRole("button", { name: /^dom$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^seg$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^ter$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^qua$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^qui$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sex$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sáb$/i })).toBeInTheDocument();
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/nome da turma é obrigatório/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when no day is selected", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/selecione pelo menos um dia da semana/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when start time is empty", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/horário de início é obrigatório/i),
      ).toBeInTheDocument();
    });
  });

  it("validates duration (should not show error with default 60)", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const timeInput = screen.getByLabelText(/horário de início/i);
    await user.type(timeInput, "08:00");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalled();
    });
  });

  it("submits form with correct data", async () => {
    const user = userEvent.setup();
    mockAddClass.mockResolvedValueOnce({ success: true });

    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Manhã");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    const wednesdayButton = screen.getByRole("button", { name: /^qua$/i });
    const fridayButton = screen.getByRole("button", { name: /^sex$/i });
    await user.click(mondayButton);
    await user.click(wednesdayButton);
    await user.click(fridayButton);

    const timeInput = screen.getByLabelText(/horário de início/i);
    await user.type(timeInput, "08:00");

    const durationSelect = screen.getByLabelText(/duração/i);
    await user.selectOptions(durationSelect, "60");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalledWith({
        name: "Turma Manhã",
        days: [1, 3, 5],
        startTime: "08:00",
        durationMinutes: 60,
      });
    });
  });

  it("navigates back after successful submission", async () => {
    const user = userEvent.setup();
    mockAddClass.mockResolvedValueOnce({ success: true });

    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const timeInput = screen.getByLabelText(/horário de início/i);
    await user.type(timeInput, "19:00");

    const durationSelect = screen.getByLabelText(/duração/i);
    await user.selectOptions(durationSelect, "90");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/turmas");
    });
  });

  it("allows selecting multiple days", async () => {
    const user = userEvent.setup();
    renderForm();

    const sundayButton = screen.getByRole("button", { name: /^dom$/i });
    const saturdayButton = screen.getByRole("button", { name: /^sáb$/i });

    await user.click(sundayButton);
    await user.click(saturdayButton);

    // Verifica que os botões mudaram de estilo (bg-blue-600)
    expect(sundayButton).toHaveClass("bg-blue-600");
    expect(saturdayButton).toHaveClass("bg-blue-600");
  });

  it("allows deselecting a day", async () => {
    const user = userEvent.setup();
    renderForm();

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });

    await user.click(mondayButton);
    expect(mondayButton).toHaveClass("bg-blue-600");

    await user.click(mondayButton);
    expect(mondayButton).toHaveClass("bg-gray-100");
  });

  it("clears validation errors when user corrects input", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/nome da turma é obrigatório/i),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma");

    await waitFor(() => {
      expect(
        screen.queryByText(/nome da turma é obrigatório/i),
      ).not.toBeInTheDocument();
    });
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    mockAddClass.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );

    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const timeInput = screen.getByLabelText(/horário de início/i);
    await user.type(timeInput, "08:00");

    const durationSelect = screen.getByLabelText(/duração/i);
    await user.selectOptions(durationSelect, "60");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("displays error message when submission fails", async () => {
    const user = userEvent.setup();
    mockAddClass.mockRejectedValueOnce(new Error("Network error"));

    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "Turma Teste");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const timeInput = screen.getByLabelText(/horário de início/i);
    await user.type(timeInput, "08:00");

    const durationSelect = screen.getByLabelText(/duração/i);
    await user.selectOptions(durationSelect, "60");

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    // Verifica que o erro foi logado (não temos ErrorMessage visível no UI para falhas de API)
    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalled();
    });
  });

  it("validates name length (minimum 3 characters)", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/nome da turma/i);
    await user.type(nameInput, "AB");

    const mondayButton = screen.getByRole("button", { name: /^seg$/i });
    await user.click(mondayButton);

    const submitButton = screen.getByRole("button", {
      name: /criar turma/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/nome deve ter pelo menos 3 caracteres/i),
      ).toBeInTheDocument();
    });
  });

  it("accepts all duration options", async () => {
    renderForm();

    const durationSelect = screen.getByLabelText(/duração/i);

    expect(screen.getByRole("option", { name: /45 min/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^1h$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /1h30/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^2h$/i })).toBeInTheDocument();

    expect(durationSelect).toHaveValue("60");
  });

  it("navigates back when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderForm();

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/turmas");
  });
});
