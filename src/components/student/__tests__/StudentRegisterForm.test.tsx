import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// Mock react-router-dom navigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Shared mock for addStudent so the component and test observe the same mock
const addStudentMock = vi.fn();
vi.mock('../StudentContext', () => ({
  useStudents: () => ({ addStudent: addStudentMock }),
}));

import RegisterForm from '../StudentRegisterForm';
import { getBeltColor } from '../StudentUtils';

describe('StudentRegisterForm', () => {
  it('submits the form and calls addStudent with derived color', async () => {
    render(<RegisterForm />);

    const name = screen.getByLabelText(/nome completo/i);
    const id = screen.getByLabelText(/matrícula/i);
    const email = screen.getByLabelText(/email/i);
    const birthday = screen.getByLabelText(/data de nascimento/i);
    const trainingSince = screen.getByLabelText(/treinando desde/i);
    const belt = screen.getByLabelText(/faixa/i);
    const submit = screen.getByRole('button', { name: /cadastrar aluno/i });

    await userEvent.type(name, 'Aluno Test');
    await userEvent.type(id, '2025001');
    await userEvent.type(email, 'a@test.com');
    await userEvent.type(birthday, '2000-01-02');
    await userEvent.type(trainingSince, '2022-01-01');
    await userEvent.selectOptions(belt, 'branca');

    await userEvent.click(submit);

    expect(addStudentMock).toHaveBeenCalled();

    type ViMockShape = { mock: { calls: unknown[][] } };
    const typedMock = addStudentMock as unknown as ViMockShape;
    const calledWith = typedMock.mock.calls[0][0] as Record<string, unknown>;
    expect(calledWith).toHaveProperty('color', getBeltColor('branca'));
    expect(calledWith).toHaveProperty('isActive', true);
    expect(calledWith).toHaveProperty('name', 'Aluno Test');
  });
});
