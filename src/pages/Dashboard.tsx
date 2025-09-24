import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
  Paper,
  Table,
  Badge,
  ActionIcon,
  Stack,
  Text,
  Loader,
  Alert,
  Select,
} from '@mantine/core';
import { IconPlus, IconEye, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { useReportStore } from '../store';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import type { PsaReportItem } from '../types';

export function Dashboard() {
  const { 
    reports, 
    loading, 
    error, 
    fetchReports, 
    deleteReport, 
    searchReports, 
    filterReportsByYear 
  } = useReportStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState(reports);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    let filtered = reports;
    
    if (searchQuery) {
      filtered = searchReports(searchQuery);
    }
    
    if (yearFilter) {
      filtered = filterReportsByYear(parseInt(yearFilter));
    }
    
    if (searchQuery && yearFilter) {
      filtered = searchReports(searchQuery).filter(report => {
        const reportDate = new Date(report.datum);
        return reportDate.getFullYear() === parseInt(yearFilter);
      });
    }
    
    setFilteredReports(filtered);
  }, [reports, searchQuery, yearFilter, searchReports, filterReportsByYear]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Bericht löschen möchten?')) {
      try {
        await deleteReport(id);
        notifications.show({
          title: 'Erfolg',
          message: 'Bericht wurde gelöscht',
          color: 'green',
        });
      } catch {
        notifications.show({
          title: 'Fehler',
          message: 'Bericht konnte nicht gelöscht werden',
          color: 'red',
        });
      }
    }
  };

  const getErgebnisColor = (ergebnis: string) => {
    switch (ergebnis) {
      case 'GUT': return 'green';
      case 'BEOBACHTEN': return 'yellow';
      case 'REPARIEREN': return 'orange';
      case 'AUSSONDERN': return 'red';
      default: return 'gray';
    }
  };

  const getWorstErgebnis = (items: PsaReportItem[]): string => {
    const priorities = { 'AUSSONDERN': 4, 'REPARIEREN': 3, 'BEOBACHTEN': 2, 'GUT': 1 };
    return items.reduce((worst, item) => {
      const currentPriority = priorities[item.ergebnis];
      const worstPriority = priorities[worst as keyof typeof priorities];
      return currentPriority > worstPriority ? item.ergebnis : worst;
    }, 'GUT');
  };

  // Generate year options for filter
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  if (loading && reports.length === 0) {
    return (
      <Container size="xl">
        <Group justify="center" py="xl">
          <Loader size="lg" />
          <Text>Berichte werden geladen...</Text>
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>PSA-Berichte Dashboard</Title>
          <Button
            component={Link}
            to="/new"
            leftSection={<IconPlus size={16} />}
            size="lg"
          >
            Neuer Bericht
          </Button>
        </Group>

        <Paper p="md" withBorder>
          <Group grow>
            <TextInput
              placeholder="Suchen nach Anwender, Prüfer oder Ort..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
            <Select
              placeholder="Jahr filtern"
              value={yearFilter}
              onChange={(value) => setYearFilter(value || '')}
              data={yearOptions}
              clearable
            />
          </Group>
        </Paper>

        {error && (
          <Alert variant="light" color="red" title="Fehler">
            {error}
          </Alert>
        )}

        {filteredReports.length === 0 ? (
          <Paper p="xl" ta="center">
            <Text size="lg" c="dimmed">
              {reports.length === 0 
                ? 'Noch keine Berichte vorhanden. Erstellen Sie Ihren ersten Bericht!'
                : 'Keine Berichte entsprechen den Suchkriterien.'
              }
            </Text>
            {reports.length === 0 && (
              <Button
                component={Link}
                to="/new"
                leftSection={<IconPlus size={16} />}
                mt="md"
              >
                Ersten Bericht erstellen
              </Button>
            )}
          </Paper>
        ) : (
          <Paper withBorder>
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Anwender</Table.Th>
                    <Table.Th>Prüfer</Table.Th>
                    <Table.Th>Ort</Table.Th>
                    <Table.Th>Datum</Table.Th>
                    <Table.Th>Anzahl Items</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Aktionen</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredReports.map((report) => (
                    <Table.Tr key={report.id}>
                      <Table.Td>
                        <Text fw={500}>{report.anwender}</Text>
                      </Table.Td>
                      <Table.Td>{report.prueferName || '-'}</Table.Td>
                      <Table.Td>{report.ort || '-'}</Table.Td>
                      <Table.Td>
                        {dayjs(report.datum).format('DD.MM.YYYY')}
                      </Table.Td>
                      <Table.Td>{report.items.length}</Table.Td>
                      <Table.Td>
                        <Badge color={getErgebnisColor(getWorstErgebnis(report.items))}>
                          {getWorstErgebnis(report.items)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            component={Link}
                            to={`/view/${report.id}`}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="orange"
                            component={Link}
                            to={`/edit/${report.id}`}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDelete(report.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        )}

        {filteredReports.length > 0 && (
          <Text size="sm" c="dimmed" ta="center">
            {filteredReports.length} von {reports.length} Berichten angezeigt
          </Text>
        )}
      </Stack>
    </Container>
  );
}