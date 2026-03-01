import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  addEmployee,
  clearSearchResult,
  editEmployee,
  loadEmployees,
  removeEmployee,
  searchEmployeeById,
  selectEmployees,
  selectEmployeesError,
  selectEmployeesLoading,
  selectSearchError,
  selectSearchLoading,
  selectSearchResult,
  setSelectedEmployee,
  selectSelectedEmployee,
} from '../employeesSlice';
import {
  loadCountries,
  selectCountries,
  selectCountriesError,
  selectCountriesLoading,
} from '../../countries/countriesSlice';
import EmployeeListView from './EmployeeListView';
import EmployeeFormView, { EmployeeFormValues } from './EmployeeFormView';
import { Employee } from '../../../api/employeesApi';
import { showSuccessAlert, showErrorAlert, showDeleteConfirmation } from '../../../utils/swal';

const EmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const employeesLoading = useAppSelector(selectEmployeesLoading);
  const employeesError = useAppSelector(selectEmployeesError);
  const selectedEmployee = useAppSelector(selectSelectedEmployee);

  const countries = useAppSelector(selectCountries);
  const countriesLoading = useAppSelector(selectCountriesLoading);
  const countriesError = useAppSelector(selectCountriesError);

  const searchResult = useAppSelector(selectSearchResult);
  const searchLoading = useAppSelector(selectSearchLoading);
  const searchError = useAppSelector(selectSearchError);

  const [formOpen, setFormOpen] = useState(false);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    dispatch(loadEmployees());
    dispatch(loadCountries());
  }, [dispatch]);

  useEffect(() => {
    if (employeesError) {
      showErrorAlert(employeesError);
    } else if (countriesError) {
      showErrorAlert(countriesError);
    }
  }, [employeesError, countriesError]);

  // Only show SweetAlert for non-404 search errors (actual errors, not "not found")
  useEffect(() => {
    if (searchError && !searchError.includes('404') && !searchError.toLowerCase().includes('not found')) {
      showErrorAlert(searchError);
    }
  }, [searchError]);

  const countriesById = useMemo(
    () =>
      countries.reduce<Record<string, string>>((acc, country) => {
        acc[country.id] = country.name;
        return acc;
      }, {}),
    [countries]
  );

  const handleAddClick = () => {
    dispatch(setSelectedEmployee(null));
    setFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    dispatch(setSelectedEmployee(employee));
    setFormOpen(true);
  };

  const handleDeleteClick = async (employee: Employee) => {
    const confirmed = await showDeleteConfirmation(employee.name);
    if (confirmed && employee.id) {
      try {
        await dispatch(removeEmployee(employee.id)).unwrap();
        showSuccessAlert('Employee deleted successfully');
        dispatch(loadEmployees());
      } catch (error: any) {
        showErrorAlert(error.message || 'Failed to delete employee');
      }
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) return;
    dispatch(searchEmployeeById(searchId.trim()));
  };

  const handleClearSearch = () => {
    setSearchId('');
    dispatch(clearSearchResult());
  };

  const handleFormSubmit = async (values: EmployeeFormValues) => {
    try {
      if (selectedEmployee?.id) {
        await dispatch(
          editEmployee({
            id: selectedEmployee.id,
            payload: values,
          })
        ).unwrap();
        showSuccessAlert('Employee updated successfully');
      } else {
        await dispatch(addEmployee(values)).unwrap();
        showSuccessAlert('Employee created successfully');
      }
      dispatch(loadEmployees());
      setFormOpen(false);
      dispatch(setSelectedEmployee(null));
    } catch (error: any) {
      showErrorAlert(error.message || 'Failed to save employee');
    }
  };

  const handleCancelForm = () => {
    setFormOpen(false);
    dispatch(setSelectedEmployee(null));
  };

  const initialFormValues: EmployeeFormValues | undefined = selectedEmployee
    ? {
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        mobile: selectedEmployee.mobile,
        countryId: selectedEmployee.countryId,
        state: selectedEmployee.state,
        district: selectedEmployee.district,
      }
    : undefined;

  useEffect(() => {
    dispatch(clearSearchResult());
  }, [dispatch, searchId]);

  return (
    <Container maxWidth={false} sx={{ py: 2, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box>
        <EmployeeListView
          employees={employees}
          countriesById={countriesById}
          loading={employeesLoading || countriesLoading}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          searchId={searchId}
          onSearchIdChange={setSearchId}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          searchLoading={searchLoading}
          searchResult={searchResult}
          searchError={searchError}
        />

        <EmployeeFormView
          open={formOpen}
          initialValues={initialFormValues}
          countries={countries}
          submitting={employeesLoading || countriesLoading}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      </Box>
    </Container>
  );
};

export default EmployeePage;
