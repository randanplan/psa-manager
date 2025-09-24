# Installation und Setup

## Voraussetzungen

- **Node.js**: Version 18 oder höher (empfohlen: LTS).
- **npm**: Version 8 oder höher.
- **Supabase-Konto**: Für Authentifizierung, Datenbank und Storage.
- **Git**: Für Versionskontrolle.
- **Texteditor**: VS Code empfohlen (für Copilot-Unterstützung).

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

   - Öffne `.env.local` und füge die Supabase-Schlüssel hinzu:

     ```env
     VITE_SUPABASE_URL=deine-supabase-url
     VITE_SUPABASE_ANON_KEY=dein-anon-key
     ```

     Erhalte diese Schlüssel aus deinem Supabase-Projekt-Dashboard (unter Settings > API).

4. **Entwicklungsserver starten**:

   ```bash
   npm run dev
   ```

   Öffne `http://localhost:5173` im Browser.

5. **Supabase einrichten**:

   - Erstelle ein Supabase-Projekt (`https://supabase.com`).
   - Erstelle eine Tabelle `psa_reports` in der Datenbank mit den Feldern:

     ```sql
     id (uuid, primary key, default uuid_generate_v4()),
     anwender (text),
     prueferName (text, nullable),
     ort (text, nullable),
     datum (timestamp with time zone),
     items (jsonb),
     createdAt (timestamp with time zone, default now()),
     updatedAt (timestamp with time zone, default now()),
     createdBy (uuid, nullable),
     updatedBy (uuid, nullable)
     ```

   - Aktiviere Row-Level-Security (RLS) und füge Policies hinzu, z. B.:

     ```sql
     -- Nur authentifizierte Nutzer können lesen/schreiben
     create policy "auth_read_write" on psa_reports
     for all
     to authenticated
     using (true);
     ```

6. **Optional: Deployment auf Vercel**:
   - Verbinde die Repo mit Vercel (via GitHub).
   - Füge Umgebungsvariablen in Vercel hinzu (wie oben).
   - Deploye mit `vercel --prod`.

## Abhängigkeiten

- **Frontend**: React v19, TypeScript, Vite, React Router, Mantine v8 (@mantine/core, @mantine/form, @mantine/dates, @mantine/notifications, @mantine/hooks), Zustand.
- **Zusätzliche Bibliotheken**: qrcode.react, dayjs, jspdf (mit autotable), xlsx (SheetJS).
- **Backend**: Supabase (@supabase/supabase-js).

Siehe `package.json` für genaue Versionen.
