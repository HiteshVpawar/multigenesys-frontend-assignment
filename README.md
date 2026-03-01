# Multigenesys

An employee management application built with React and TypeScript. Perform full CRUD operations on employees, search by ID, and manage employee data with country selection.

## Features

- **Employee Management**: Create, read, update, and delete employees
- **Search by ID**: Find employees by their unique ID
- **Country Selection**: Employee form includes country dropdown (with flags) from external API
- **Modern UI**: Material-UI (MUI) components with a clean, responsive design
- **Form Validation**: React Hook Form with Yup schema validation
- **State Management**: Redux Toolkit for employees and countries data

## Tech Stack

- **React 19** with TypeScript
- **Redux Toolkit** – state management
- **Material-UI (MUI)** – UI components
- **React Hook Form** + **Yup** – form handling and validation
- **Axios** – HTTP client
- **SweetAlert2** – alerts and confirmations

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── axiosClient.ts
│   ├── employeesApi.ts
│   └── countriesApi.ts
├── components/       # Reusable UI components
│   └── common/       # ConfirmDialog, ErrorSnackbar, SuccessSnackbar
├── features/
│   ├── employees/   # Employee list, form, page, and slice
│   └── countries/   # Countries slice
├── utils/           # Utilities (e.g. SweetAlert helpers)
├── hooks.ts         # Typed Redux hooks
└── store.ts         # Redux store configuration
```

## API

The app uses a mock API at `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1`:

- `GET/POST /employee` – list and create employees
- `GET/PUT/DELETE /employee/:id` – fetch, update, delete employee
- `GET /country` – list countries (for dropdown)

## Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: This is a one-way operation.** Ejects from Create React App to expose build configuration. See [Create React App docs](https://facebook.github.io/create-react-app/docs/getting-started) for details.

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI](https://mui.com/)
