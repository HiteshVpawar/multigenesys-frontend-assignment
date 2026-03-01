import axiosClient from './axiosClient';

// Shape used across the app
export interface Country {
  id: string;
  name: string;
  flag?: string;
}

// Raw shape returned by the mock API
interface ApiCountry {
  id: string;
  country: string;
  flag?: string;
}

export async function fetchCountries(): Promise<Country[]> {
  const response = await axiosClient.get<ApiCountry[]>('/country');
  // Map API `country` field to our internal `name` field, and include flag
  return response.data.map((c) => ({
    id: c.id,
    name: c.country,
    flag: c.flag,
  }));
}
