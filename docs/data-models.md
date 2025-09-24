# Datenmodelle

Die Datenmodelle sind in TypeScript definiert und spiegeln die Struktur der PSA-Prüfberichte wider. Sie werden in `src/types/index.ts` gespeichert und sowohl im Frontend als auch für die Supabase-Datenbank verwendet.

## PsaReportItem

Repräsentiert einen einzelnen geprüften PSA-Gegenstand (z. B. Gurt, Karabiner).

```typescript
export interface PsaReportItem {
  index?: number; // Laufende Nummer in der Tabelle
  itemDescription: string; // Bezeichnung (Hersteller, Typ, Variante)
  enNorm: string; // EN-Normen, durch Leerzeichen getrennt
  itemSN: string; // Seriennummer
  baujahr: number; // Herstellungsjahr
  zustand: string; // Zustand (z. B. "OK", "Mantelabrieb")
  ergebnis: "GUT" | "BEOBACHTEN" | "REPARIEREN" | "AUSSONDERN"; // Prüfergebnis
  naechstePruefung: string | Date; // Datum der nächsten Prüfung (z. B. "2025" oder "05/2025")
}
```

## PsaReport

Repräsentiert einen vollständigen Prüfbericht.

```typescript
export interface PsaReport {
  id: string; // UUID, generiert von Supabase
  anwender: string; // Name des Anwenders (z. B. "Natalie")
  prueferName?: string; // Name des Prüfers
  ort?: string; // Ort der Prüfung (z. B. "Berlin")
  datum: string | Date; // Prüfdatum (ISO-Format oder Date)
  items: PsaReportItem[]; // Liste der geprüften Gegenstände
  createdAt?: string | Date; // Erstellungszeitpunkt
  updatedAt?: string | Date; // Änderungszeitpunkt
  createdBy?: string; // UID des Erstellers
  updatedBy?: string; // UID des letzten Bearbeiters
}
```

## Supabase-Datenbank

- Tabelle: `psa_reports`
- Spalten:
  - `id`: UUID (Primärschlüssel)
  - `anwender`: text
  - `prueferName`: text (optional)
  - `ort`: text (optional)
  - `datum`: timestamp with time zone
  - `items`: jsonb (Array von PsaReportItem)
  - `createdAt`, `updatedAt`: timestamp with time zone
  - `createdBy`, `updatedBy`: uuid (optional, für Auth-Nutzer)
