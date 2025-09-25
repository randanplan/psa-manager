# Cloud-Setup für PSA-Manager

## Überblick

Diese Datei beschreibt die Einrichtung der Cloud-Umgebung für die PSA-Manager Web-Anwendung, die Prüfungen der Persönlichen Schutzausrüstung (PSA) gemäß BGR 198/199 digitalisiert. Die Cloud-Umgebung nutzt Supabase für Authentifizierung, Datenbank und Storage sowie Vercel für das Hosting des Frontends. Sie ist für Entwickler und Coding-Agents (z. B. Qwen, Copilot) gedacht.

Siehe `docs/index.md` für einen Überblick und `docs/setup-local.md` für das lokale Setup.

## Voraussetzungen

- **Supabase-Konto**: Erstelle ein Konto auf <https://supabase.com>.
- **Vercel-Konto**: Erstelle ein Konto auf <https://vercel.com>.
- **GitHub-Repository**: `https://github.com/randanplan/psa-manager`.
- **Node.js**: Für lokale Vercel-Tests (Version 18 oder höher).
- **npm**: Version 8 oder höher.

## Einrichtung

1. **Supabase Cloud-Projekt erstellen**:

   - Gehe zu <https://supabase.com/dashboard> und erstelle ein neues Projekt.
   - Notiere die Projekt-URL (`https://dein-projekt.supabase.co`) und den `anon key` (aus Settings > API).
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

     Führe das SQL im Supabase-Dashboard (SQL Editor) aus.

   - Aktiviere Row-Level-Security (RLS):

     ```sql
     alter table psa_reports enable row level security;
     create policy "auth_read_write" on psa_reports
       for all
       to authenticated
       using (true)
       with check (true);
     ```

   - Optional: Erstelle ein Storage-Bucket für Dateien (z. B. PSA-Fotos):

     ```sql
     create bucket psa_files;
     create policy "allow_authenticated_uploads" on storage.objects
       for insert
       to authenticated
       with check (bucket_id = 'psa_files');
     ```

2. **Umgebungsvariablen konfigurieren**: - Für lokale Tests mit Cloud-Konfiguration erstelle eine `.env.local` Datei mit folgender Struktur:

   ```env
   # Cloud Supabase Konfiguration (ersetze mit deinen echten Werten)
   VITE_SUPABASE_URL=https://dein-projekt-id.supabase.co
   VITE_SUPABASE_ANON_KEY=dein-anon-key-hier

   # Zusätzliche Vercel-Variablen (automatisch gesetzt bei Deployment)
   SUPABASE_URL=https://dein-projekt-id.supabase.co
   SUPABASE_ANON_KEY=dein-anon-key-hier
   SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key-hier

   # PostgreSQL-Verbindungen (für erweiterte Nutzung)
   POSTGRES_URL=postgres://postgres.projekt-id:passwort@host:5432/postgres?sslmode=require
   POSTGRES_DATABASE=postgres
   POSTGRES_HOST=db.projekt-id.supabase.co
   POSTGRES_USER=postgres
   ```

   - **Echte Werte abrufen**: Hole deine echten Schlüssel aus dem Supabase-Dashboard:

     - Gehe zu Settings > API
     - Kopiere `Project URL` und `anon public` Key
     - **Wichtig**: Service Role Key nur für serverseitige Operationen verwenden!

   - **Vercel Deployment**: Diese Variablen werden automatisch von Vercel gesetzt. Wichtige Variablen für die App:

     - `VITE_SUPABASE_URL`: Cloud-Projekt URL
     - `VITE_SUPABASE_ANON_KEY`: Anonymer Schlüssel für Client-seitige Operationen

   - **Sicherheit**: Der `SUPABASE_SERVICE_ROLE_KEY` sollte nur serverseitig verwendet werden und niemals im Frontend.

3. **Vercel Deployment**:

   - **Projekt-Link**: Das Projekt ist bereits mit Vercel verbunden:

     - Repository: `https://github.com/randanplan/psa-manager`
     - Vercel-Projekt: `psa-manager` (Team: `randanplans-projects`)

   - Teste lokal mit Vercel:

     ```bash
     vercel dev
     ```

   - Deploye in die Cloud:

     ```bash
     vercel --prod
     ```

   - **Automatische Vercel-Integration**: Die `.env.local` enthält bereits die von Vercel gesetzten Variablen:

     - `VERCEL_OIDC_TOKEN`: OAuth-Token für sichere Deployment-Authentifizierung
     - Alle Supabase-Konfigurationen werden automatisch übertragen

   - **Build-Konfiguration**: Vercel erkennt Vite automatisch. Package.json enthält die korrekten Build-Skripte:

     ```json
     "scripts": {
       "build": "tsc && vite build",
       "preview": "vite preview"
     }
     ```

4. **Lokales Schema in die Cloud migrieren** (optional):

   - Wenn du das lokale Schema (aus `docs/setup-local.md`) in die Cloud übertragen willst:

     ```bash
     supabase login
     supabase db push
     ```

5. **Teste die Cloud-Umgebung**:

   - **Deployment-URL**: Die App ist verfügbar unter der von Vercel generierten URL.
   - **Datenbank-Test**: Teste eine Supabase-Abfrage mit den konkreten Cloud-Parametern:

     ```typescript
     import { supabase } from "../lib/supabase";

     // Test mit der Cloud-Konfiguration
     const testConnection = async () => {
       const { data, error } = await supabase.from("psa_reports").select("*");
       if (error) {
         console.error("Supabase Error:", error);
       } else {
         console.log("Cloud connection successful:", data);
       }
     };
     ```

   - **Cloud-Authentifizierung testen**:

     ```typescript
     import { supabase } from "../lib/supabase";

     // Test User Registration
     const { data, error } = await supabase.auth.signUp({
       email: "test@example.com",
       password: "test123456",
     });
     ```

## Abhängigkeiten

- **Frontend**: React v19, TypeScript, Vite, React Router, Mantine v8 (@mantine/core, @mantine/form, @mantine/dates, @mantine/notifications, @mantine/hooks), Zustand.
- **Zusätzliche Bibliotheken**: qrcode.react, dayjs, jspdf (mit autotable), xlsx (SheetJS).
- **Backend**: Supabase (@supabase/supabase-js).

Siehe `package.json` für genaue Versionen.

## Hinweise für Coding-Agents

- **Cloud-URL verwenden**: Nutze deine spezifische Supabase-URL (z.B. `https://dein-projekt-id.supabase.co`) für Supabase-Operationen in der Cloud-Umgebung.
- **Authentifizierte Requests**: Beispiel für einen Cloud-Insert:

  ```typescript
  import { supabase } from "../lib/supabase";

  // Cloud-Insert mit der tatsächlichen Projekt-URL
  const { data, error } = await supabase.from("psa_reports").insert({
    anwender: "Natalie",
    datum: new Date().toISOString(),
    items: [
      {
        itemDescription: "Gurt",
        itemSN: "12345",
        baujahr: 2022,
        zustand: "OK",
        ergebnis: "GUT",
        naechstePruefung: "2026",
      },
    ],
  });

  if (error) console.error("Cloud Insert Error:", error);
  ```

- **Umgebungsumschaltung**: Für lokale Entwicklung nutze die lokalen Variablen:

  ```typescript
  // In src/lib/supabase.ts wird automatisch die richtige URL verwendet
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  ```

- **Deployment-Variablen**: Vercel setzt automatisch alle erforderlichen Umgebungsvariablen. Die `.env.local` Datei zeigt die aktuelle Konfiguration.

- **PostgreSQL-Zugriff**: Für direkte Datenbankoperationen (falls nötig) nutze die `POSTGRES_URL` Verbindungszeichenkette.

## Fehlerbehebung

- **Supabase-Verbindung fehlschlägt**:

  - Prüfe deine spezifische Projekt-URL aus dem Supabase-Dashboard
  - Überprüfe den Anon Key in der `.env.local` Datei
  - Teste die Verbindung im Supabase-Dashboard unter Settings > API

- **Vercel-Deployment schlägt fehl**:

  - Prüfe Logs im Vercel-Dashboard (Project > Functions > Logs)
  - Stelle sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
  - Kontrolliere Build-Logs für TypeScript-Fehler

- **Authentifizierung funktioniert nicht**:

  - Überprüfe RLS-Policies in der Supabase-Datenbank
  - Stelle sicher, dass die Auth-Konfiguration aktiviert ist
  - Prüfe CORS-Einstellungen in Supabase (Settings > Auth > Site URL)

- **Secret Scanning Alerts**:

  - Niemals echte API-Schlüssel in der Dokumentation oder im Code committen
  - Nutze Umgebungsvariablen und `.env.local` für lokale Entwicklung
  - Bei versehentlicher Veröffentlichung: Schlüssel in Supabase rotieren

- **PostgreSQL-Verbindung**: Bei direkten DB-Verbindungen verwende die korrekte Connection-String aus deiner `.env.local`

- Siehe `docs/troubleshooting.md` für weitere Tipps und lokale Debugging-Methoden.
