import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock react-router-dom navigate
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

// Shared mock for addStudent so the component and test observe the same mock
const addStudentMock = vi.fn();
vi.mock("../StudentContext", () => ({
  useStudents: () => ({ addStudent: addStudentMock }),
}));

import RegisterForm from "../StudentRegisterForm";

describe("StudentRegisterForm", () => {
  beforeEach(() => {
    // Criar alert se não existir e mockar
    if (!window.alert) {
      window.alert = () => {};
    }
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("submits the form and calls addStudent with derived color", async () => {
    render(<RegisterForm />);

    const name = screen.getByLabelText(/nome completo/i);
    const registry = screen.getByLabelText(/matrícula/i);
    const birthday = screen.getByLabelText(/data de nascimento/i);
    const trainingSince = screen.getByLabelText(/treinando desde/i);
    const belt = screen.getByLabelText(/faixa/i);
    const submit = screen.getByRole("button", { name: /cadastrar aluno/i });

    await userEvent.type(name, "Aluno Test");
    await userEvent.type(registry, "2025001");
    await userEvent.type(birthday, "2000-01-02");
    await userEvent.type(trainingSince, "2022-01-01");
    await userEvent.selectOptions(belt, "White");

    await userEvent.click(submit);

    expect(addStudentMock).toHaveBeenCalled();

    type ViMockShape = { mock: { calls: unknown[][] } };
    const typedMock = addStudentMock as unknown as ViMockShape;
    const calledWith = typedMock.mock.calls[0][0] as Record<string, unknown>;
    expect(calledWith).toHaveProperty("belt", "White");
    expect(calledWith).toHaveProperty("name", "Aluno Test");
    expect(calledWith).toHaveProperty("registry", "2025001");
    expect(calledWith).toHaveProperty("birthday", "2000-01-02");
    expect(calledWith).toHaveProperty("trainingSince", "2022-01-01");
  });
});
