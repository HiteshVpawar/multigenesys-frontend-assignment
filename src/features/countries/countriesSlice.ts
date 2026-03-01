import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Country, fetchCountries } from '../../api/countriesApi';
import { RootState } from '../../store';

export interface CountriesState {
  items: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountriesState = {
  items: [],
  loading: false,
  error: null,
};

export const loadCountries = createAsyncThunk<Country[]>(
  'countries/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCountries();
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Failed to load countries');
    }
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load countries';
      });
  },
});

export const selectCountries = (state: RootState) => state.countries.items;
export const selectCountriesLoading = (state: RootState) => state.countries.loading;
export const selectCountriesError = (state: RootState) => state.countries.error;

export default countriesSlice.reducer;

