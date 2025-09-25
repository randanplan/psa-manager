import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, AppShell, Group, Title, Button, Container, createTheme, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { useAuthStore } from './store';
import { Dashboard } from './pages/Dashboard';
import { NewReport } from './pages/NewReport';
import { EditReport } from './pages/EditReport';
import { ViewReport } from './pages/ViewReport';
import { Login } from './pages/Login';



import { useMantineTheme } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
});

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
  const { user, signOut } = useAuthStore();

  // Responsive Design: Prüfen, ob das Gerät mobil ist
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  if (!user) {
    return <Login />;
  }

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={isMobile ? 3 : 2} c="blue">
                {isMobile ? 'PSA' : 'PSA-Manager'}
              </Title>
              <Group gap={isMobile ? 'xs' : 'md'}>
                {!isMobile && (
                  <Text size="sm">Willkommen, {user.email}</Text>
                )}
                <Button
                  variant="light"
                  onClick={signOut}
                  size={isMobile ? 'xs' : 'sm'}
                >
                  Abmelden
                </Button>
              </Group>
            </Group>
          </AppShell.Header>

          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewReport />} />
              <Route path="/edit/:id" element={<EditReport />} />
              <Route path="/view/:id" element={<ViewReport />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell.Main>
    </AppShell>
  );
};

export default App;
