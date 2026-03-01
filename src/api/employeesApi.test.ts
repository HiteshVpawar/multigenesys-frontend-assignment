import axiosClient from './axiosClient';
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './employeesApi';

jest.mock('./axiosClient');

const mockedAxios = axiosClient as jest.Mocked<typeof axiosClient>;

describe('employeesApi', () => {
  it('fetchEmployees calls correct endpoint', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const result = await fetchEmployees();
    expect(mockedAxios.get).toHaveBeenCalledWith('/employee');
    expect(result).toEqual([]);
  });

  it('fetchEmployeeById calls correct endpoint', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { id: '1' } });
    const result = await fetchEmployeeById('1');
    expect(mockedAxios.get).toHaveBeenCalledWith('/employee/1');
    expect(result).toEqual({ id: '1' });
  });

  it('createEmployee posts payload', async () => {
    const payload = {
      name: 'Test',
      email: 'test@example.com',
      mobile: '1234567890',
      countryId: '1',
      state: 'State',
      district: 'District',
    };
    mockedAxios.post.mockResolvedValueOnce({ data: { id: '1', ...payload } });
    const result = await createEmployee(payload);
    expect(mockedAxios.post).toHaveBeenCalledWith('/employee', payload);
    expect(result.id).toBe('1');
  });

  it('updateEmployee puts payload', async () => {
    const payload = {
      name: 'Test2',
      email: 'test2@example.com',
      mobile: '1234567890',
      countryId: '1',
      state: 'State2',
      district: 'District2',
    };
    mockedAxios.put.mockResolvedValueOnce({ data: { id: '1', ...payload } });
    const result = await updateEmployee('1', payload);
    expect(mockedAxios.put).toHaveBeenCalledWith('/employee/1', payload);
    expect(result.name).toBe('Test2');
  });

  it('deleteEmployee calls delete endpoint', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });
    await deleteEmployee('1');
    expect(mockedAxios.delete).toHaveBeenCalledWith('/employee/1');
  });
});

