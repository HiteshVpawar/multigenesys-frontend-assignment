import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createEmployee,
  deleteEmployee,
  Employee,
  EmployeePayload,
  fetchEmployeeById,
  fetchEmployees,
  updateEmployee,
} from '../../api/employeesApi';
import { RootState } from '../../store';

export interface EmployeesState {
  items: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
  searchLoading: boolean;
  searchError: string | null;
  searchResult: Employee | null;
}

const initialState: EmployeesState = {
  items: [],
  loading: false,
  error: null,
  selectedEmployee: null,
  searchLoading: false,
  searchError: null,
  searchResult: null,
};

export const loadEmployees = createAsyncThunk<Employee[]>(
  'employees/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEmployees();
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to load employees');
    }
  }
);

export const searchEmployeeById = createAsyncThunk<Employee, string>(
  'employees/searchById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEmployeeById(id);
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Employee not found');
    }
  }
);

export const addEmployee = createAsyncThunk<Employee, EmployeePayload>(
  'employees/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await createEmployee(payload);
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to create employee');
    }
  }
);

export const editEmployee = createAsyncThunk<Employee, { id: string; payload: EmployeePayload }>(
  'employees/edit',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateEmployee(id, payload);
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to update employee');
    }
  }
);

export const removeEmployee = createAsyncThunk<string, string>(
  'employees/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to delete employee');
    }
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSelectedEmployee(state, action: PayloadAction<Employee | null>) {
      state.selectedEmployee = action.payload;
    },
    clearSearchResult(state) {
      state.searchResult = null;
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all
      .addCase(loadEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load employees';
      })
      // Search by ID
      .addCase(searchEmployeeById.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchResult = null;
      })
      .addCase(searchEmployeeById.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResult = action.payload;
      })
      .addCase(searchEmployeeById.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = (action.payload as string) ?? 'Employee not found';
      })
      // Add
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to create employee';
      })
      // Edit
      .addCase(editEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to update employee';
      })
      // Remove
      .addCase(removeEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((e) => e.id !== action.payload);
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to delete employee';
      });
  },
});

export const { setSelectedEmployee, clearSearchResult } = employeesSlice.actions;

export const selectEmployees = (state: RootState) => state.employees.items;
export const selectEmployeesLoading = (state: RootState) => state.employees.loading;
export const selectEmployeesError = (state: RootState) => state.employees.error;

export const selectSelectedEmployee = (state: RootState) => state.employees.selectedEmployee;
export const selectSearchResult = (state: RootState) => state.employees.searchResult;
export const selectSearchLoading = (state: RootState) => state.employees.searchLoading;
export const selectSearchError = (state: RootState) => state.employees.searchError;

export default employeesSlice.reducer;

