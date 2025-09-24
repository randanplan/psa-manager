import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Loader, Alert, Text } from '@mantine/core';
import { useReportStore } from '../store';
import { ReportForm } from '../components/ReportForm';

export function EditReport() {
  const { id } = useParams<{ id: string }>();
  const { getReportById, fetchReports } = useReportStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadReport = async () => {
      try {
        await fetchReports();
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReport();
  }, [fetchReports]);

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <Loader size="lg" />
          <Text>Bericht wird geladen...</Text>
        </div>
      </Container>
    );
  }

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const report = getReportById(id);

  if (!report) {
    return (
      <Container size="sm" py="xl">
        <Alert variant="light" color="red" title="Bericht nicht gefunden">
          Der angeforderte Bericht konnte nicht gefunden werden.
        </Alert>
      </Container>
    );
  }

  return <ReportForm report={report} isEditing />;
}