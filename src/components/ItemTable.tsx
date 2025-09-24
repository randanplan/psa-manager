import { useState } from 'react';
import {
  Table,
  Button,
  TextInput,
  Select,
  NumberInput,
  ActionIcon,
  Group,
  Stack,
  Modal,
  Grid,
  Badge,
  Text,
  Paper,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash, IconQrcode } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';

import type { PsaReportItem, ErgebnisType } from '../types';

interface ItemTableProps {
  items: PsaReportItem[];
  onChange: (items: PsaReportItem[]) => void;
  editable?: boolean;
}

interface ItemFormValues {
  itemDescription: string;
  enNorm: string;
  itemSN: string;
  baujahr: number;
  zustand: string;
  ergebnis: ErgebnisType;
  naechstePruefung: Date;
}

const ergebnisOptions = [
  { value: 'GUT', label: 'GUT' },
  { value: 'BEOBACHTEN', label: 'BEOBACHTEN' },
  { value: 'REPARIEREN', label: 'REPARIEREN' },
  { value: 'AUSSONDERN', label: 'AUSSONDERN' },
];

export function ItemTable({ items, onChange, editable = false }: ItemTableProps) {
  const [opened, setOpened] = useState(false);
  const [editingItem, setEditingItem] = useState<PsaReportItem | null>(null);
  const [qrModalOpened, setQrModalOpened] = useState(false);
  const [selectedSN, setSelectedSN] = useState('');

  const form = useForm<ItemFormValues>({
    initialValues: {
      itemDescription: '',
      enNorm: '',
      itemSN: '',
      baujahr: new Date().getFullYear(),
      zustand: '',
      ergebnis: 'GUT',
      naechstePruefung: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    validate: {
      itemDescription: (value) => (value.trim().length === 0 ? 'Beschreibung ist erforderlich' : null),
      enNorm: (value) => (value.trim().length === 0 ? 'EN-Norm ist erforderlich' : null),
      itemSN: (value) => (value.trim().length === 0 ? 'Seriennummer ist erforderlich' : null),
      baujahr: (value) => {
        const currentYear = new Date().getFullYear();
        return value < 1900 || value > currentYear + 1 ? 'Ungültiges Baujahr' : null;
      },
      zustand: (value) => (value.trim().length === 0 ? 'Zustand ist erforderlich' : null),
      naechstePruefung: (value) => (value ? null : 'Nächste Prüfung ist erforderlich'),
    },
  });

  const openAddModal = () => {
    setEditingItem(null);
    form.reset();
    setOpened(true);
  };

  const openEditModal = (item: PsaReportItem) => {
    setEditingItem(item);
    form.setValues({
      itemDescription: item.itemDescription,
      enNorm: item.enNorm,
      itemSN: item.itemSN,
      baujahr: item.baujahr,
      zustand: item.zustand,
      ergebnis: item.ergebnis,
      naechstePruefung: new Date(item.naechstePruefung),
    });
    setOpened(true);
  };

  const handleSubmit = (values: ItemFormValues) => {
    const newItem: PsaReportItem = {
      itemDescription: values.itemDescription.trim(),
      enNorm: values.enNorm.trim(),
      itemSN: values.itemSN.trim(),
      baujahr: values.baujahr,
      zustand: values.zustand.trim(),
      ergebnis: values.ergebnis,
      naechstePruefung: values.naechstePruefung,
    };

    if (editingItem) {
      // Update existing item
      const itemIndex = items.findIndex(item => 
        item.itemSN === editingItem.itemSN && 
        item.itemDescription === editingItem.itemDescription
      );
      if (itemIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[itemIndex] = newItem;
        onChange(updatedItems);
      }
    } else {
      // Check for duplicate serial numbers
      if (items.some(item => item.itemSN === newItem.itemSN)) {
        notifications.show({
          title: 'Fehler',
          message: 'Ein Item mit dieser Seriennummer existiert bereits',
          color: 'red',
        });
        return;
      }
      // Add new item
      onChange([...items, newItem]);
    }

    setOpened(false);
    form.reset();
    notifications.show({
      title: 'Erfolg',
      message: `Item wurde ${editingItem ? 'aktualisiert' : 'hinzugefügt'}`,
      color: 'green',
    });
  };

  const handleDelete = (itemSN: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Item löschen möchten?')) {
      onChange(items.filter(item => item.itemSN !== itemSN));
      notifications.show({
        title: 'Erfolg',
        message: 'Item wurde gelöscht',
        color: 'green',
      });
    }
  };

  const showQRCode = (itemSN: string) => {
    setSelectedSN(itemSN);
    setQrModalOpened(true);
  };

  const getErgebnisColor = (ergebnis: ErgebnisType) => {
    const colors = {
      'GUT': 'green',
      'BEOBACHTEN': 'yellow',
      'REPARIEREN': 'orange',
      'AUSSONDERN': 'red',
    };
    return colors[ergebnis];
  };

  return (
    <Stack gap="md">
      {editable && (
        <Group justify="flex-end">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddModal}
          >
            Item hinzufügen
          </Button>
        </Group>
      )}

      {items.length === 0 ? (
        <Paper p="xl" ta="center">
          <Text size="lg" c="dimmed">
            Noch keine PSA-Items vorhanden
          </Text>
          {editable && (
            <Button
              leftSection={<IconPlus size={16} />}
              mt="md"
              onClick={openAddModal}
            >
              Erstes Item hinzufügen
            </Button>
          )}
        </Paper>
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Beschreibung</Table.Th>
                <Table.Th>EN-Norm</Table.Th>
                <Table.Th>Seriennummer</Table.Th>
                <Table.Th>Baujahr</Table.Th>
                <Table.Th>Zustand</Table.Th>
                <Table.Th>Ergebnis</Table.Th>
                <Table.Th>Nächste Prüfung</Table.Th>
                <Table.Th>Aktionen</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item, index) => (
                <Table.Tr key={`${item.itemSN}-${index}`}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{item.itemDescription}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.enNorm}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{item.itemSN}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.baujahr}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.zustand}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getErgebnisColor(item.ergebnis)} size="sm">
                      {item.ergebnis}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {dayjs(item.naechstePruefung).format('DD.MM.YYYY')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        size="sm"
                        onClick={() => showQRCode(item.itemSN)}
                      >
                        <IconQrcode size={14} />
                      </ActionIcon>
                      {editable && (
                        <>
                          <ActionIcon
                            variant="light"
                            color="orange"
                            size="sm"
                            onClick={() => openEditModal(item)}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(item.itemSN)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      {/* Add/Edit Item Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingItem ? 'Item bearbeiten' : 'Neues Item hinzufügen'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Beschreibung"
                  placeholder="z.B. Schutzhelm, Sicherheitsgurt..."
                  {...form.getInputProps('itemDescription')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  required
                  label="EN-Norm"
                  placeholder="z.B. EN 397, EN 361..."
                  {...form.getInputProps('enNorm')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  required
                  label="Seriennummer"
                  placeholder="Eindeutige Seriennummer"
                  {...form.getInputProps('itemSN')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <NumberInput
                  required
                  label="Baujahr"
                  placeholder="YYYY"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  {...form.getInputProps('baujahr')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  required
                  label="Zustand"
                  placeholder="z.B. Neu, Gebraucht, Beschädigt..."
                  {...form.getInputProps('zustand')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  required
                  label="Prüfergebnis"
                  data={ergebnisOptions}
                  {...form.getInputProps('ergebnis')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <DateInput
                  required
                  label="Nächste Prüfung"
                  placeholder="Wählen Sie ein Datum"
                  valueFormat="DD.MM.YYYY"
                  {...form.getInputProps('naechstePruefung')}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setOpened(false)}>
                Abbrechen
              </Button>
              <Button type="submit">
                {editingItem ? 'Aktualisieren' : 'Hinzufügen'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        opened={qrModalOpened}
        onClose={() => setQrModalOpened(false)}
        title="QR-Code für Seriennummer"
        size="sm"
        centered
      >
        <Stack align="center" gap="md">
          <QRCodeSVG
            value={selectedSN}
            size={200}
            level="M"
            includeMargin
          />
          <Text ta="center" fw={500}>
            Seriennummer: {selectedSN}
          </Text>
        </Stack>
      </Modal>
    </Stack>
  );
}