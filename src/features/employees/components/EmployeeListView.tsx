import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Chip,
  Pagination,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import { Employee } from '../../../api/employeesApi';

export interface EmployeeListViewProps {
  employees: Employee[];
  countriesById: Record<string, string>;
  loading: boolean;
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  searchId: string;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  searchLoading: boolean;
  searchResult: Employee | null;
  searchError: string | null;
}

const ITEMS_PER_PAGE = 10;

type SortKey = 'id' | 'name' | 'email' | 'mobile' | 'country' | 'state' | 'district';

const EmployeeListView: React.FC<EmployeeListViewProps> = ({
  employees,
  countriesById,
  loading,
  onAdd,
  onEdit,
  onDelete,
  searchId,
  onSearchIdChange,
  onSearch,
  onClearSearch,
  searchLoading,
  searchResult,
  searchError,
}) => {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (searchResult) {
      setPage(1);
    }
  }, [searchResult]);

  const displayEmployees = useMemo(() => {
    if (searchResult) {
      return [searchResult];
    }
    return employees;
  }, [searchResult, employees]);

  const sortedEmployees = useMemo(() => {
    if (searchResult) {
      return displayEmployees;
    }

    const employeesCopy = [...displayEmployees];

    employeesCopy.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortKey) {
        case 'id':
          aValue = a.id ?? '';
          bValue = b.id ?? '';
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'mobile':
          aValue = a.mobile || '';
          bValue = b.mobile || '';
          break;
        case 'country': {
          const getName = (emp: Employee): string => {
            if (emp.countryName) {
              return emp.countryName;
            }
            if (emp.countryId && countriesById[emp.countryId]) {
              return countriesById[emp.countryId];
            }
            return emp.countryId || 'N/A';
          };

          aValue = getName(a);
          bValue = getName(b);
          break;
        }
        case 'state':
          aValue = a.state || '';
          bValue = b.state || '';
          break;
        case 'district':
          aValue = a.district || '';
          bValue = b.district || '';
          break;
        default:
          break;
      }

      const compareResult = aValue.localeCompare(bValue, undefined, {
        sensitivity: 'base',
        numeric: true,
      });

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });

    return employeesCopy;
  }, [displayEmployees, sortKey, sortDirection, countriesById, searchResult]);

  const paginatedEmployees = useMemo(() => {
    if (searchResult) {
      return [searchResult];
    }
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedEmployees.slice(startIndex, endIndex);
  }, [sortedEmployees, page, searchResult]);

  const totalPages = Math.ceil(displayEmployees.length / ITEMS_PER_PAGE);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSort = (column: SortKey) => {
    if (searchResult) {
      return;
    }

    setPage(1);

    if (sortKey === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(column);
      setSortDirection('asc');
    }
  };

  const getCountryName = (employee: Employee): string => {
    if (employee.countryName) {
      return employee.countryName;
    }
    if (employee.countryId && countriesById[employee.countryId]) {
      return countriesById[employee.countryId];
    }
    return employee.countryId || 'N/A';
  };

  const startIndex = searchResult ? 1 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = searchResult ? 1 : Math.min(page * ITEMS_PER_PAGE, displayEmployees.length);

  // Check if search was performed and resulted in error (not found)
  const isSearchNotFound = searchError && (searchError.includes('404') || searchError.toLowerCase().includes('not found'));

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', mt: 2, px: { xs: 2, sm: 3 }, pb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                mb: 0.25,
              }}
            >
              Employee Management
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              Manage and organize employee information efficiently
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
          }}
        >
          Add New Employee
        </Button>
      </Box>

      {/* Actions Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}>
            <Typography
              variant="caption"
              sx={{
                mb: 0.75,
                display: 'block',
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                ml: 0.5,
              }}
            >
              Search Employee by ID
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter employee ID..."
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchId.trim()) {
                  onSearch();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  height: 40,
                },
              }}
              InputProps={{
                endAdornment: searchId && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={onClearSearch}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={
              searchLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            onClick={onSearch}
            disabled={!searchId.trim() || searchLoading}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              height: 40,
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearSearch}
            disabled={!searchId && !searchResult && !searchError}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              height: 40,
            }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* All Employees Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              All Employees
            </Typography>
            {searchResult && (
              <Chip
                label="Search Result"
                size="small"
                sx={{
                  bgcolor: 'info.light',
                  color: 'info.dark',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
          <Chip
            label={`${displayEmployees.length} ${displayEmployees.length === 1 ? 'record' : 'records'}`}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: 'grey.200',
                  '& th': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                  },
                }}
              >
              <TableCell sx={{ width: '8%' }}>
                <TableSortLabel
                  active={sortKey === 'id'}
                  direction={sortKey === 'id' ? sortDirection : 'asc'}
                  onClick={() => handleSort('id')}
                  disabled={!!searchResult}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={sortKey === 'name'}
                  direction={sortKey === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                  disabled={!!searchResult}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '18%' }}>
                <TableSortLabel
                  active={sortKey === 'email'}
                  direction={sortKey === 'email' ? sortDirection : 'asc'}
                  onClick={() => handleSort('email')}
                  disabled={!!searchResult}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '12%' }}>
                <TableSortLabel
                  active={sortKey === 'mobile'}
                  direction={sortKey === 'mobile' ? sortDirection : 'asc'}
                  onClick={() => handleSort('mobile')}
                  disabled={!!searchResult}
                >
                  Mobile
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '12%' }}>
                <TableSortLabel
                  active={sortKey === 'country'}
                  direction={sortKey === 'country' ? sortDirection : 'asc'}
                  onClick={() => handleSort('country')}
                  disabled={!!searchResult}
                >
                  Country
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '12%' }}>
                <TableSortLabel
                  active={sortKey === 'state'}
                  direction={sortKey === 'state' ? sortDirection : 'asc'}
                  onClick={() => handleSort('state')}
                  disabled={!!searchResult}
                >
                  State
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '12%' }}>
                <TableSortLabel
                  active={sortKey === 'district'}
                  direction={sortKey === 'district' ? sortDirection : 'asc'}
                  onClick={() => handleSort('district')}
                  disabled={!!searchResult}
                >
                  District
                </TableSortLabel>
              </TableCell>
                <TableCell sx={{ width: '11%' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : isSearchNotFound ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500 }}>
                      Data not found
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                      No employee found with ID: {searchId}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="body2">
                      No employees found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((emp, index) => (
                  <TableRow
                    key={emp.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      '& td': {
                        py: 1.5,
                        borderBottom: index === paginatedEmployees.length - 1 ? 'none' : '1px solid',
                        borderColor: 'divider',
                        fontSize: '0.875rem',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.id || ''} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.id}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.name} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.name}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.email} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.email}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.mobile} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.mobile}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={getCountryName(emp)} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Chip
                            label={getCountryName(emp)}
                            size="small"
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              height: 24,
                              maxWidth: '100%',
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.state || '-'} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.state || '-'}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={emp.district || '-'} arrow placement="top" enterDelay={300}>
                        <Box
                          component="span"
                          sx={{
                            display: 'block',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {emp.district || '-'}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => onEdit(emp)}
                            size="small"
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.light',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => onDelete(emp)}
                            size="small"
                            sx={{
                              '&:hover': {
                                bgcolor: 'error.light',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {displayEmployees.length > 0 && !searchResult && !isSearchNotFound && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              flexWrap: 'wrap',
              gap: 1.5,
              bgcolor: 'grey.50',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Showing {startIndex} to {endIndex} of {displayEmployees.length} employees
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Previous
              </Button>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
                hidePrevButton
                hideNextButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 1,
                    fontWeight: 600,
                    minWidth: 32,
                    height: 32,
                  },
                }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 80,
                }}
              >
                Next
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeListView;
