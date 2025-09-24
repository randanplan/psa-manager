import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, AppShell, Group, Title, Button, Container } from '@mantine/core';
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

function App() {
  const { user, loading, initialize, signOut } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <MantineProvider defaultColorScheme="light">
        <Container size="sm" pt="xl">
          <Title order={2} ta="center">PSA-Manager wird geladen...</Title>
        </Container>
      </MantineProvider>
    );
  }

  if (!user) {
    return (
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <Login />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications />
      <Router>
        <AppShell
          header={{ height: 70 }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Title order={2} c="blue">PSA-Manager</Title>
              <Group>
                <span>Willkommen, {user.email}</span>
                <Button variant="light" onClick={signOut}>
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
      </Router>
    </MantineProvider>
  );
}

export default App;
