import axiosClient from './axiosClient';

export interface Employee {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  countryId: string;
  countryName?: string;
  state: string;
  district: string;
}

export interface EmployeePayload {
  name: string;
  email: string;
  mobile: string;
  countryId: string;
  state: string;
  district: string;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await axiosClient.get<Employee[]>('/employee');
  return response.data;
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  const response = await axiosClient.get<Employee>(`/employee/${id}`);
  return response.data;
}

export async function createEmployee(payload: EmployeePayload): Promise<Employee> {
  const response = await axiosClient.post<Employee>('/employee', payload);
  return response.data;
}

export async function updateEmployee(id: string, payload: EmployeePayload): Promise<Employee> {
  const response = await axiosClient.put<Employee>(`/employee/${id}`, payload);
  return response.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await axiosClient.delete(`/employee/${id}`);
}

