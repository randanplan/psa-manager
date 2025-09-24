# Lokales Setup für PSA-Manager

## Überblick

Diese Datei beschreibt die Einrichtung der lokalen Entwicklungsumgebung für die PSA-Manager Web-Anwendung, die Prüfungen der Persönlichen Schutzausrüstung (PSA) gemäß BGR 198/199 digitalisiert. Die lokale Umgebung nutzt Vite, React, TypeScript, Mantine v8 und eine lokale Supabase-Instanz für Authentifizierung, Datenbank und Storage. Sie ist für Entwickler und Coding-Agents (z. B. Qwen, Copilot) gedacht.

Siehe `docs/index.md` für einen Überblick und `docs/setup-cloud.md` für das Cloud-Setup.

## Voraussetzungen

- **Node.js**: Version 18 oder höher (empfohlen: LTS).
- **npm**: Version 8 oder höher.
- **Supabase CLI**: Für lokale Supabase-Instanz (siehe https://supabase.com/docs/guides/cli).
- **Git**: Für Versionskontrolle.
- **Texteditor**: VS Code empfohlen (mit Erweiterungen für ESLint, Prettier, Supabase).

## Installation

1. **Repository klonen**:

   ```bash
   git clone https://github.com/randanplan/psa-manager.git
   cd psa-manager
   ```

2. **Abhängigkeiten installieren**:

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**:

   - Kopiere `.env.example` nach `.env.local`:

     ```bash
     cp .env.example .env.local
     ```

   - Bearbeite `.env.local` mit lokalen Supabase-Schlüsseln (siehe Schritt 4):

     ```env
     VITE_SUPABASE_URL=http://localhost:54323
     VITE_SUPABASE_ANON_KEY=dein-lokaler-anon-key
     ```

4. **Supabase lokal einrichten**:

   - Installiere die Supabase CLI:

     ```bash
     npm install -g supabase
     ```

   - Initialisiere Supabase im Projekt-Root:

     ```bash
     supabase init
     ```

     Dies erstellt `supabase/config.toml`.

   - Starte die lokale Supabase-Instanz:

     ```bash
     supabase start
     ```

     - Öffne das Dashboard: `http://localhost:54323`.
     - Notiere `anon key` und `service_role key` aus der Ausgabe von `supabase start` oder `supabase/config.toml`.

   - Erstelle die `psa_reports`-Tabelle:

     ```sql
     create extension if not exists "uuid-ossp";
     create table psa_reports (
       id uuid primary key default uuid_generate_v4(),
       anwender text not null,
       prueferName text,
       ort text,
       datum timestamp with time zone not null,
       items jsonb not null,
       createdAt timestamp with time zone default now(),
       updatedAt timestamp with time zone default now(),
       createdBy uuid,
       updatedBy uuid
     );
     ```

     Führe das SQL im Supabase-Dashboard (SQL Editor) oder via CLI aus:

     ```bash
     supabase db psql -c "create table ..."
     ```

   - Aktiviere Row-Level-Security (RLS):

     ```sql
     alter table psa_reports enable row level security;
     create policy "auth_read_write" on psa_reports
       for all
       to authenticated
       using (true)
       with check (true);
     ```

5. **Entwicklungsserver starten**:

   ```bash
   npm run dev
   ```

   Öffne `http://localhost:5173` im Browser.

6. **Teste Authentifizierung**:

   - Erstelle einen Testnutzer:

     ```bash
     supabase auth signup --email test@example.com --password test123
     ```

   - Teste den Login in deiner App (z. B. via `src/pages/Login.tsx`).

## Abhängigkeiten

- **Frontend**: React v19, TypeScript, Vite, React Router, Mantine v8 (@mantine/core, @mantine/form, @mantine/dates, @mantine/notifications, @mantine/hooks), Zustand.
- **Zusätzliche Bibliotheken**: qrcode.react, dayjs, jspdf (mit autotable), xlsx (SheetJS).
- **Backend**: Supabase (@supabase/supabase-js).

Siehe `package.json` für genaue Versionen.

## Hinweise für Coding-Agents

- Verwende `http://localhost:54323` als `VITE_SUPABASE_URL` für lokale Tests.
- Mocke Supabase für Tests (siehe `docs/testing-and-linting.md`).
- Beispiel für einen lokalen Supabase-Insert in `src/components/ReportForm.tsx`:

  ```typescript
  import { supabase } from '../lib/supabase';
  const { data, error } = await supabase.from('psa_reports').insert({
    anwender: 'Natalie',
    datum: new Date().toISOString(),
    items: [{ itemDescription: 'Gurt', itemSN: '12345', baujahr: 2022, ... }],
  });
  ```

## Fehlerbehebung

- **Supabase startet nicht**: Prüfe Docker (erforderlich für Supabase CLI) und `supabase status`.
- **CORS-Fehler**: Stelle sicher, dass `allowed_origins` in `supabase/config.toml` auf `http://localhost:5173` gesetzt ist.
- Siehe `docs/troubleshooting.md` für weitere Tipps.
