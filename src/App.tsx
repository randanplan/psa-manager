import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/nprogress/styles.css';
import { createTheme, MantineProvider, useMantineTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuthStore } from './store'; // Zustand Store für Auth
import {Dashboard} from './pages/Dashboard';
import {NewReport} from './pages/NewReport';
import {ViewReport} from './pages/ViewReport';
import {Login} from './pages/Login';
import './App.css';

// Theme-Konfiguration für ein professionelles, dunkles Design
const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  fontFamily: 'Arial, sans-serif',
  headings: { fontFamily: 'Arial, sans-serif' },
});

// Layout-Komponente für Authentifizierung und Navigation
const RootLayout: React.FC = () => {
  const { initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return user ? <AuthenticatedApp /> : <Login />;
};

// Authentifizierte App mit Navigation
const AuthenticatedApp: React.FC = () => {
  const theme = useMantineTheme();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
      errorElement: <div>404 - Seite nicht gefunden</div>,
    },
    {
      path: '/report/new',
      element: <NewReport />,
    },
    {
      path: '/report/:id',
      element: <ViewReport />,
    },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.dark[7] }}>
      <RouterProvider router={router} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" withCssVariables>
      <Notifications position="top-right" />
      <RootLayout />
    </MantineProvider>
  );
};

export default App;