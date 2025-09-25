import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextInput,
  Button,
  Group,
  Stack,
  Title,
  Grid,
  Container,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';


import { useReportStore } from '../store';
import { ItemTable } from './ItemTable';
import type { PsaReport, PsaReportItem } from '../types';

interface ReportFormProps {
  report?: PsaReport;
  isEditing?: boolean;
}

interface FormValues {
  anwender: string;
  prueferName: string;
  ort: string;
  datum: Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export function ReportForm({ report, isEditing = false }: ReportFormProps) {
  const navigate = useNavigate();
  const { createReport, updateReport } = useReportStore();
  const [items, setItems] = useState<PsaReportItem[]>(report?.items || []);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      anwender: report?.anwender || '',
      prueferName: report?.prueferName || '',
      ort: report?.ort || '',
      datum: report?.datum ? new Date(report.datum) : new Date(),
      createdAt: report?.createdAt ? new Date(report.createdAt) : new Date(),
      updatedAt: report?.updatedAt ? new Date(report.updatedAt) : new Date(),
    },
    validate: {
      anwender: (value) => (value.trim().length === 0 ? 'Anwender ist erforderlich' : null),
      datum: (value) => (value ? null : 'Datum ist erforderlich'),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      notifications.show({
        title: 'Fehler',
        message: 'Mindestens ein PSA-Item ist erforderlich',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        anwender: values.anwender,
        prueferName: values.prueferName || undefined,
        ort: values.ort || undefined,
        datum: values.datum,
        createdAt: values.createdAt || undefined,
        updatedAt: values.updatedAt || undefined,
        items: items.map((item, index) => ({ ...item, index })),
      };

      if (isEditing && report) {
        await updateReport(report.id, reportData);
        notifications.show({
          title: 'Erfolg',
          message: 'Bericht wurde aktualisiert',
          color: 'green',
        });
      } else {
        await createReport(reportData);
        notifications.show({
          title: 'Erfolg',
          message: 'Bericht wurde erstellt und wird im Dashboard angezeigt',
          color: 'green',
        });

        // Navigiere zurück zum Dashboard - es wird automatisch neu geladen
        navigate('/', { replace: true });
        return;
      }

      navigate('/');
    } catch {
      notifications.show({
        title: 'Fehler',
        message: `Bericht konnte nicht ${isEditing ? 'aktualisiert' : 'erstellt'} werden`,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>
            {isEditing ? 'Bericht bearbeiten' : 'Neuer PSA-Bericht'}
          </Title>
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            Zurück
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Paper p="md" withBorder>
              <Title order={3} mb="md">Allgemeine Informationen</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    required
                    label="Anwender"
                    placeholder="Name des PSA-Anwenders"
                    {...form.getInputProps('anwender')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Prüfer"
                    placeholder="Name des Prüfers"
                    {...form.getInputProps('prueferName')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Ort"
                    placeholder="Prüfungsort"
                    {...form.getInputProps('ort')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    required
                    label="Prüfungsdatum"
                    placeholder="Wählen Sie ein Datum"
                    valueFormat="DD.MM.YYYY"
                    {...form.getInputProps('datum')}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper p="md" withBorder>
              <Title order={3} mb="md">PSA-Items</Title>
              <ItemTable
                items={items}
                onChange={setItems}
                editable={true}
              />
            </Paper>

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => navigate('/')}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                loading={loading}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                {isEditing ? 'Aktualisieren' : 'Speichern'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}