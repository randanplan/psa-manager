import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
  Group,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../store';

interface LoginFormValues {
  email: string;
  password: string;
}

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: 'test@example.com',
      password: 'test123',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Ungültige E-Mail-Adresse'),
      password: (value) => (value.length < 6 ? 'Passwort muss mindestens 6 Zeichen haben' : null),
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      if (isRegistering) {
        await signUp(values.email, values.password);
        notifications.show({
          title: 'Registrierung erfolgreich',
          message: 'Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.',
          color: 'green',
        });
        setIsRegistering(false);
      } else {
        await signIn(values.email, values.password);
        notifications.show({
          title: 'Anmeldung erfolgreich',
          message: 'Willkommen bei PSA-Manager!',
          color: 'green',
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
      notifications.show({
        title: 'Fehler',
        message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" my={40}>
      <Title order={1} ta="center" mb="xl">
        PSA-Manager
      </Title>

      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="md">
          {isRegistering ? 'Registrieren' : 'Anmelden'}
        </Title>

        <Alert variant="light" color="blue" mb="md">
          <Text size="sm">
            {isRegistering
              ? 'Erstellen Sie ein neues Konto für PSA-Manager'
              : 'Melden Sie sich mit Ihrem PSA-Manager Konto an'
            }
          </Text>
        </Alert>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="E-Mail"
              placeholder="ihre-email@beispiel.de"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Passwort"
              placeholder="Ihr Passwort"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />

            <Button
              type="submit"
              radius="md"
              loading={loading}
              fullWidth
              mt="md"
            >
              {isRegistering ? 'Registrieren' : 'Anmelden'}
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt="lg">
          <Text size="sm">
            {isRegistering ? 'Haben Sie bereits ein Konto?' : 'Noch kein Konto?'}
          </Text>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Anmelden' : 'Registrieren'}
          </Button>
        </Group>

      </Paper>
    </Container>
  );
}