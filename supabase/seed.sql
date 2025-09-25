-- supabase/seed.sql

-- Testberichte in psa_reports einfügen
INSERT INTO psa_reports (anwender, prueferName, ort, datum, items, createdBy, updatedBy)
VALUES (
  'Test-User',
  'Max Mustermann',
  'Berlin',
  '2025-09-24T10:00:00+02:00',
  '[
    {
      "itemDescription": "Sicherheitsgurt",
      "itemSN": "TEST123",
      "baujahr": 2023,
      "zustand": "OK",
      "ergebnis": "GUT",
      "naechstePruefung": "2026"
    },
    {
      "itemDescription": "Helm",
      "itemSN": "HELM456",
      "baujahr": 2022,
      "zustand": "OK",
      "ergebnis": "GUT",
      "naechstePruefung": "2025"
    }
  ]'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
),
(
  'Test-User',
  'Anna Beispiel',
  'München',
  '2025-08-15T14:30:00+02:00',
  '[
    {
      "itemDescription": "Karabiner",
      "itemSN": "TEST123",
      "baujahr": 2024,
      "zustand": "OK",
      "ergebnis": "GUT",
      "naechstePruefung": "2027"
    }
  ]'::jsonb,
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;