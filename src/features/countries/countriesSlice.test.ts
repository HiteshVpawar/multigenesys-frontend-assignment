import countriesReducer, { CountriesState, loadCountries } from './countriesSlice';

describe('countriesSlice', () => {
  const initialState: CountriesState = {
    items: [],
    loading: false,
    error: null,
  };

  it('handles loadCountries.pending', () => {
    const nextState = countriesReducer(initialState, {
      type: loadCountries.pending.type,
    });
    expect(nextState.loading).toBe(true);
  });

  it('handles loadCountries.fulfilled', () => {
    const payload = [{ id: '1', name: 'India' }];
    const nextState = countriesReducer(initialState, {
      type: loadCountries.fulfilled.type,
      payload,
    });
    expect(nextState.items).toEqual(payload);
  });
});

