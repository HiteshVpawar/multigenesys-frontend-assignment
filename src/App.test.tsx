import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { store } from './store';
import App from './App';

test('renders Employees heading', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const heading = screen.getByText(/Employees/i);
  expect(heading).toBeInTheDocument();
});
