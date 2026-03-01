import employeesReducer, {
  EmployeesState,
  loadEmployees,
  addEmployee,
  removeEmployee,
} from './employeesSlice';
import { Employee } from '../../api/employeesApi';

describe('employeesSlice', () => {
  const initialState: EmployeesState = {
    items: [],
    loading: false,
    error: null,
    selectedEmployee: null,
    searchLoading: false,
    searchError: null,
    searchResult: null,
  };

  it('handles loadEmployees.pending', () => {
    const nextState = employeesReducer(initialState, {
      type: loadEmployees.pending.type,
    });
    expect(nextState.loading).toBe(true);
  });

  it('handles addEmployee.fulfilled', () => {
    const employee: Employee = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      mobile: '1234567890',
      countryId: '1',
      state: 'State',
      district: 'District',
    };

    const nextState = employeesReducer(initialState, {
      type: addEmployee.fulfilled.type,
      payload: employee,
    });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].name).toBe('John');
  });

  it('handles removeEmployee.fulfilled', () => {
    const withItems: EmployeesState = {
      ...initialState,
      items: [
        {
          id: '1',
          name: 'John',
          email: 'john@example.com',
          mobile: '1234567890',
          countryId: '1',
          state: 'State',
          district: 'District',
        },
      ],
    };

    const nextState = employeesReducer(withItems, {
      type: removeEmployee.fulfilled.type,
      payload: '1',
    });

    expect(nextState.items).toHaveLength(0);
  });
});

