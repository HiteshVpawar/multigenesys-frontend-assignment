import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Country } from '../../../api/countriesApi';

export interface EmployeeFormValues {
  name: string;
  email: string;
  mobile: string;
  countryId: string;
  state: string;
  district: string;
}

export interface EmployeeFormViewProps {
  open: boolean;
  initialValues?: EmployeeFormValues;
  countries: Country[];
  submitting: boolean;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  mobile: yup
    .string()
    .required('Mobile is required')
    .matches(/^[0-9]{10,15}$/, 'Enter a valid mobile number (10-15 digits)'),
  countryId: yup.string().required('Country is required'),
  state: yup
    .string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must not exceed 50 characters'),
  district: yup
    .string()
    .required('District is required')
    .min(2, 'District must be at least 2 characters')
    .max(50, 'District must not exceed 50 characters'),
});

const EmployeeFormView: React.FC<EmployeeFormViewProps> = ({
  open,
  initialValues,
  countries,
  submitting,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormValues>({
    defaultValues: initialValues ?? {
      name: '',
      email: '',
      mobile: '',
      countryId: '',
      state: '',
      district: '',
    },
    resolver: yupResolver(validationSchema),
  });

  React.useEffect(() => {
    if (open) {
      reset(
        initialValues ?? {
          name: '',
          email: '',
          mobile: '',
          countryId: '',
          state: '',
          district: '',
        }
      );
    }
  }, [open, initialValues, reset]);

  const handleFormSubmit = (values: EmployeeFormValues) => {
    onSubmit(values);
  };

  const isEdit = Boolean(initialValues);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          pt: 2.5,
          px: 2.5,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isEdit ? (
              <EditIcon sx={{ fontSize: 20, color: 'white' }} />
            ) : (
              <PersonAddIcon sx={{ fontSize: 20, color: 'white' }} />
            )}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              Fill in the details to {isEdit ? 'update' : 'create'} a new employee.
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent
        dividers
        sx={{
          p: 2.5,
        }}
      >
        <Box
          component="form"
          id="employee-form"
          noValidate
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  placeholder="Enter employee name"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  placeholder="Enter employee email"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile"
                  placeholder="Enter mobile number"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.countryId} required>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      {...field}
                      labelId="country-label"
                      label="Country"
                      displayEmpty
                      renderValue={(value) => {
                        if (!value) {
                          return <em style={{ color: '#9e9e9e' }}>Select country</em>;
                        }
                        const country = countries.find((c) => c.id === value);
                        if (!country) return value;
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {country.flag && (
                              <img
                                src={country.flag}
                                alt={country.name}
                                style={{
                                  width: 20,
                                  height: 15,
                                  objectFit: 'cover',
                                  borderRadius: 2,
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <span>{country.name}</span>
                          </Box>
                        );
                      }}
                      sx={{
                        borderRadius: 1.5,
                      }}
                      startAdornment={
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <PublicIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="" disabled>
                        <em>Select country</em>
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.id} value={country.id}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {country.flag ? (
                              <img
                                src={country.flag}
                                alt={country.name}
                                style={{
                                  width: 24,
                                  height: 18,
                                  objectFit: 'cover',
                                  borderRadius: 2,
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <PublicIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={country.name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.countryId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.countryId.message}
                      </Typography>
                    )}
                  </FormControl>
              )}
            />
          </Box>
          <Box>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="State"
                  placeholder="Enter state"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="District"
                  placeholder="Enter district"
                  fullWidth
                  required
                  size="small"
                  error={!!errors.district}
                  helperText={errors.district?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        sx={{
          p: 2,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={submitting}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 100,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="employee-form"
          variant="contained"
          disabled={submitting}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 100,
          }}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormView;
