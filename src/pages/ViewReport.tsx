import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Group,
  Button,
  Stack,
  Grid,
  Text,
  Loader,
  Alert,
  Divider,
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconFileTypePdf, 
  IconFileTypeXls 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { useReportStore } from '../store';
import { ItemTable } from '../components/ItemTable';
import type { PsaReport } from '../types';

export function ViewReport() {
  const { id } = useParams<{ id: string }>();
  const { getReportById, fetchReports } = useReportStore();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<PsaReport | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        await fetchReports();
        if (id) {
          const foundReport = getReportById(id);
          setReport(foundReport || null);
        }
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id, getReportById, fetchReports]);

  const exportToPDF = () => {
    if (!report) return;

    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('PSA-Prüfbericht', 20, 30);
      
      // Report info
      doc.setFontSize(12);
      doc.text(`Anwender: ${report.anwender}`, 20, 50);
      doc.text(`Prüfer: ${report.prueferName || 'N/A'}`, 20, 60);
      doc.text(`Ort: ${report.ort || 'N/A'}`, 20, 70);
      doc.text(`Datum: ${dayjs(report.datum).format('DD.MM.YYYY')}`, 20, 80);
      
      // Items table
      const tableData = report.items.map((item, index) => [
        index + 1,
        item.itemDescription,
        item.enNorm,
        item.itemSN,
        item.baujahr.toString(),
        item.zustand,
        item.ergebnis,
        dayjs(item.naechstePruefung).format('DD.MM.YYYY'),
      ]);

      autoTable(doc, {
        startY: 90,
        head: [['#', 'Beschreibung', 'EN-Norm', 'Seriennummer', 'Baujahr', 'Zustand', 'Ergebnis', 'Nächste Prüfung']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
        },
      });

      doc.save(`PSA-Bericht_${report.anwender}_${dayjs(report.datum).format('YYYY-MM-DD')}.pdf`);
      
      notifications.show({
        title: 'Erfolg',
        message: 'PDF wurde erfolgreich erstellt',
        color: 'green',
      });
    } catch (error) {
      console.error(
        `Error generating PDF for report ID: ${report?.id || 'unknown'}, Anwender: ${report?.anwender || 'unknown'}`,
        error
      );
      notifications.show({
        title: 'Fehler',
        message: 'PDF konnte nicht erstellt werden',
        color: 'red',
      });
    }
  };

  const exportToExcel = () => {
    if (!report) return;

    try {
      const wb = XLSX.utils.book_new();
      
      // Report info sheet
      const reportInfo = [
        ['PSA-Prüfbericht'],
        [''],
        ['Anwender:', report.anwender],
        ['Prüfer:', report.prueferName || 'N/A'],
        ['Ort:', report.ort || 'N/A'],
        ['Datum:', dayjs(report.datum).format('DD.MM.YYYY')],
        ['Erstellt am:', report.createdAt ? dayjs(report.createdAt).format('DD.MM.YYYY HH:mm') : 'N/A'],
        [''],
        ['PSA-Items:'],
        ['#', 'Beschreibung', 'EN-Norm', 'Seriennummer', 'Baujahr', 'Zustand', 'Ergebnis', 'Nächste Prüfung'],
        ...report.items.map((item, index) => [
          index + 1,
          item.itemDescription,
          item.enNorm,
          item.itemSN,
          item.baujahr,
          item.zustand,
          item.ergebnis,
          dayjs(item.naechstePruefung).format('DD.MM.YYYY'),
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(reportInfo);
      
      // Set column widths
      const colWidths = [
        { wch: 5 },
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'PSA-Bericht');
      
      XLSX.writeFile(wb, `PSA-Bericht_${report.anwender}_${dayjs(report.datum).format('YYYY-MM-DD')}.xlsx`);
      
      notifications.show({
        title: 'Erfolg',
        message: 'Excel-Datei wurde erfolgreich erstellt',
        color: 'green',
      });
    } catch (error) {
      console.error('Error generating Excel:', error);
      notifications.show({
        title: 'Fehler',
        message: 'Excel-Datei konnte nicht erstellt werden',
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Group justify="center">
          <Loader size="lg" />
          <Text>Bericht wird geladen...</Text>
        </Group>
      </Container>
    );
  }

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (!report) {
    return (
      <Container size="sm" py="xl">
        <Alert variant="light" color="red" title="Bericht nicht gefunden">
          Der angeforderte Bericht konnte nicht gefunden werden.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>PSA-Prüfbericht</Title>
          <Group>
            <Button
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
              component={Link}
              to="/"
            >
              Zurück
            </Button>
            <Button
              variant="light"
              color="orange"
              leftSection={<IconEdit size={16} />}
              component={Link}
              to={`/edit/${report.id}`}
            >
              Bearbeiten
            </Button>
          </Group>
        </Group>

        <Paper p="md" withBorder>
          <Title order={3} mb="md">Allgemeine Informationen</Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="sm" c="dimmed">Anwender</Text>
              <Text fw={500}>{report.anwender}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="sm" c="dimmed">Prüfer</Text>
              <Text fw={500}>{report.prueferName || 'N/A'}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="sm" c="dimmed">Ort</Text>
              <Text fw={500}>{report.ort || 'N/A'}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="sm" c="dimmed">Prüfungsdatum</Text>
              <Text fw={500}>{dayjs(report.datum).format('DD.MM.YYYY')}</Text>
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="sm" c="dimmed">Erstellt am</Text>
              <Text size="sm">
                {report.createdAt ? dayjs(report.createdAt).format('DD.MM.YYYY HH:mm') : 'N/A'}
              </Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Text size="sm" c="dimmed">Zuletzt bearbeitet</Text>
              <Text size="sm">
                {report.updatedAt ? dayjs(report.updatedAt).format('DD.MM.YYYY HH:mm') : 'N/A'}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>

        <Paper p="md" withBorder>
          <Group justify="space-between" align="center" mb="md">
            <Title order={3}>PSA-Items ({report.items.length})</Title>
            <Group>
              <Button
                variant="light"
                leftSection={<IconFileTypePdf size={16} />}
                onClick={exportToPDF}
              >
                PDF Export
              </Button>
              <Button
                variant="light"
                leftSection={<IconFileTypeXls size={16} />}
                onClick={exportToExcel}
              >
                Excel Export
              </Button>
            </Group>
          </Group>
          
          <ItemTable
            items={report.items}
            onChange={() => {}} // Not editable in view mode
            editable={false}
          />
        </Paper>
      </Stack>
    </Container>
  );
}