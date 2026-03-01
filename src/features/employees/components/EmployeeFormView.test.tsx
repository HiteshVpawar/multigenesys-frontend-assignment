import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeFormView, { EmployeeFormViewProps } from './EmployeeFormView';

const baseProps: EmployeeFormViewProps = {
  open: true,
  countries: [{ id: '1', name: 'India' }],
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
};

describe('EmployeeFormView', () => {
  it('validates required fields', async () => {
    render(<EmployeeFormView {...baseProps} />);

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });

  it('submits valid data', async () => {
    render(<EmployeeFormView {...baseProps} />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mobile/i), { target: { value: '1234567890' } });
    fireEvent.mouseDown(screen.getByLabelText(/Country/i));
    fireEvent.click(screen.getByText('India'));
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'State1' } });
    fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'District1' } });

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(baseProps.onSubmit).toHaveBeenCalled();
    });
  });
});

