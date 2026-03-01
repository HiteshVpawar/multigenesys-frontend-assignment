import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeListView, { EmployeeListViewProps } from './EmployeeListView';

const baseProps: EmployeeListViewProps = {
  employees: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '1234567890',
      countryId: '1',
      state: 'State1',
      district: 'District1',
    },
  ],
  countriesById: { '1': 'India' },
  loading: false,
  onAdd: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  searchId: '',
  onSearchIdChange: jest.fn(),
  onSearch: jest.fn(),
  onClearSearch: jest.fn(),
  searchLoading: false,
  searchResult: null,
  searchError: null,
};

describe('EmployeeListView', () => {
  it('renders employee rows', () => {
    render(<EmployeeListView {...baseProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  it('calls onAdd when Add New Employee button is clicked', () => {
    render(<EmployeeListView {...baseProps} />);

    fireEvent.click(screen.getByText(/Add New Employee/i));
    expect(baseProps.onAdd).toHaveBeenCalled();
  });
});

