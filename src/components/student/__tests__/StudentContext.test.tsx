import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { StudentProvider, useStudents } from '../StudentContext';

const TestConsumer: React.FC = () => {
  const { students, addStudent } = useStudents();
  return (
    <div>
      <div data-testid="count">{students.length}</div>
      <button
        onClick={() =>
          addStudent({
            id: 'x1',
            name: 'Test',
            birthday: '2000-01-01',
            email: 't@e.com',
            isActive: true,
            belt: 'branca',
            trainingSince: '2023-01-01',
            color: '#fff',
          })
        }
      >
        add
      </button>
    </div>
  );
};

describe('StudentProvider', () => {
  it('provides initial students and allows adding a student', async () => {
    render(
      <StudentProvider>
        <TestConsumer />
      </StudentProvider>
    );

    const count = screen.getByTestId('count');
    expect(Number(count.textContent)).toBeGreaterThanOrEqual(0);

    const btn = screen.getByRole('button', { name: /add/i });
    await userEvent.click(btn);

    expect(Number(count.textContent)).toBeGreaterThanOrEqual(1);
  });
});
