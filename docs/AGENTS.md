# Anleitung für Coding-Agents

## Überblick

Diese Datei bietet spezifische Anweisungen für Coding-Agents (z. B. Qwen CLI, GitHub Copilot), um mit der PSA-Manager Web-Anwendung zu arbeiten. PSA-Manager digitalisiert Prüfungen der Persönlichen Schutzausrüstung (PSA) gemäß BGR 198/199 und nutzt React v19, TypeScript, Vite, Mantine v8, Supabase (Auth, Datenbank, Storage) sowie Bibliotheken wie `qrcode.react`, `jspdf`, `xlsx`, und `dayjs`. Ziel ist es, Agents zu helfen, den Code zu verstehen, neue Features zu implementieren, Tests zu schreiben, Linting zu gewährleisten und Fehler zu beheben.

Bitte lies die Dokumentation in `docs/` (`index.md`, `setup-local.md`, `setup-cloud.md`, `structure.md`, `data-models.md`, `features.md`, `testing-and-linting.md`, `roadmap.md`, `troubleshooting.md`) für den vollständigen Kontext.

## Projektstruktur

Die Struktur ist in `docs/structure.md` beschrieben. Wichtige Dateien für Agents:

- `src/types/index.ts`: Definiert `PsaReport` und `PsaReportItem` Interfaces (siehe `docs/data-models.md`).
- `src/lib/supabase.ts`: Initialisiert den Supabase-Client (lokal: `http://localhost:54323`, Cloud: Projekt-URL).
- `src/components/ReportForm.tsx`: Hauptformular für Berichte, nutzt `@mantine/form` für Validierung.
- `src/pages/Dashboard.tsx`: Listet Berichte, filterbar nach `anwender` oder Jahr.
- `src/store/`: Zustand-Stores für Auth (`auth.ts`) und Berichte (`reports.ts`).
- `src/test-utils/`: Test-Utilities für Vitest (siehe `docs/testing-and-linting.md`).
- `.env.local`: Umgebungsvariablen (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Anweisungen für Coding-Agents

### 1. Code verstehen

- **Datenmodelle**: Arbeite mit `PsaReport` und `PsaReportItem` aus `src/types/index.ts` (siehe `docs/data-models.md`). Beispiel:

  ```typescript
  interface PsaReport {
    id: string;
    anwender: string;
    items: PsaReportItem[];
    // ...
  }
  ```

- **Supabase**: CRUD-Operationen nutzen `@supabase/supabase-js`. Beispiel für einen Insert:

  ```typescript
  import { supabase } from "../lib/supabase";
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
  ```

- **Mantine**: Verwende Mantine-Komponenten (`@mantine/core`, `@mantine/form`, `@mantine/dates`) für UI. Formulare validieren Pflichtfelder wie `itemSN`.
- **Zustand**: Globale States in `src/store/`. Beispiel:

  ```typescript
  import { create } from "zustand";
  export const useReportStore = create((set) => ({
    reports: [],
    setReports: (reports) => set({ reports }),
  }));
  ```

### 2. Neue Features implementieren

- **Konsistenz**: Halte dich an `src/types` für Typen und `@mantine/core` für UI.
- **Modularität**: Neue Komponenten in `src/components/`, Seiten in `src/pages/`.
- **Features aus `docs/features.md`**:

  - **Excel-Import**: Parse Excel-Dateien mit `xlsx` in `ReportForm.tsx` und speichere in Supabase.

    ```typescript
    import * as XLSX from "xlsx";
    const handleImport = async (file: File) => {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      await supabase
        .from("psa_reports")
        .insert(json.map((row) => ({ ...row })));
    };
    ```

  - **PDF-Export**: Nutze `jspdf` und `autotable` für Berichte mit Kopf- und Fußdaten.
  - **QR-Codes**: Generiere QR-Codes mit `qrcode.react` basierend auf `itemSN`.

- **Roadmap**: Siehe `docs/roadmap.md` für zukünftige Features (z. B. Benachrichtigungen, Bild-Uploads).

### 3. Tests schreiben

- Nutze Vitest und React Testing Library (siehe `docs/testing-and-linting.md`).
- Verwende `src/test-utils/render.tsx` für Tests mit `MantineProvider`:

  ```typescript
  import { render, screen } from "../test-utils";
  import ReportForm from "../components/ReportForm";
  test("rendert Formular", () => {
    render(<ReportForm />);
    expect(screen.getByText(/Neuer Bericht/i)).toBeInTheDocument();
  });
  ```

- Mocke Supabase für Tests:

  ```typescript
  import { vi } from "vitest";
  vi.mock("../lib/supabase", () => ({
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    },
  }));
  ```

### 4. Linting

- Verwende `eslint-config-mantine` (siehe `docs/testing-and-linting.md`).
- Führe `npm run lint` vor Commits aus. Beispiel für linter-kompatiblen Code:

  ```typescript
  import { Button } from "@mantine/core";
  import type { PsaReport } from "../types";
  interface ReportFormProps {
    initialReport?: PsaReport;
  }
  export function ReportForm({ initialReport }: ReportFormProps) {
    return <Button>Speichern</Button>;
  }
  ```

### 5. Fehlerbehebung

- **Supabase**: Prüfe `http://localhost:54323/logs` (lokal) oder Supabase-Dashboard (Cloud) für Fehler.
- **Vitest**: Stelle sicher, dass `vitest.setup.mjs` APIs wie `matchMedia` mockt.
- **ESLint**: Führe `npm run lint:fix` aus, um Fehler automatisch zu korrigieren.
- Siehe `docs/troubleshooting.md` für Details.

### 6. Testen und Deployment

- **Lokales Setup**: Siehe `docs/setup-local.md` für lokale Entwicklung mit Supabase CLI.
- **Cloud Deployment**: Siehe `docs/setup-cloud.md` für Deployment auf Vercel mit Supabase.
- **Tests**: Führe Tests lokal mit `npm run test` aus und stelle sicher, dass alle Tests erfolgreich sind.

### 7. Beste Praktiken

- **Commits**: Schreibe klare Nachrichten, z. B. `Add QR code generation to ItemTable`.
- **Typen**: Nutze TypeScript strikt und halte dich an `src/types`.
- **Tests**: Schreibe Tests für neue Komponenten und mocke externe Abhängigkeiten (z. B. Supabase).
- **Dokumentation**: Aktualisiere `docs/` bei Änderungen, z. B. neue Features in `features.md`.

### 8. Einschränkungen

- **Supabase Free-Tier**: Beachte Limits (500 MB Storage, 2 GB DB).
- **Lokale Tests**: Keine direkten Dateisystemzugriffe außerhalb von Supabase Storage.
- **Mantine**: Alle Komponenten müssen in `MantineProvider` gewrapped sein.

### 9. Bild-/Screenshot-Analyse Workflow

Bei der Arbeit mit visuellen Elementen in der PSA-Anwendung folgen Sie diesem Workflow zur Erkennung und Analyse von Bildern/Screenshots:

#### 9.1 Erstellung von Screenshots

- Verwenden Sie Playwright-Tools zur Screenshot-Erstellung: `playwright_screenshot()`
- Speichern Sie Screenshots in bekannte Verzeichnisse oder temporäre Ordner
- Überprüfen Sie die Screenshot-Erstellung mit Dateisystem-Checks

#### 9.2 Identifizierung von Bildpositionen

- Überprüfen Sie gängige Download-Verzeichnisse: `C:\Users\[Benutzername]\Downloads\`
- Suchen Sie nach zeitgestempelten Dateinamen von Playwright
- Verwenden Sie Shell-Befehle zum Auflisten und Überprüfen von Bilddateien

#### 9.3 Bild-Analyse-Tools

- **Gemini CLI Tool**: Primäres Tool für Bildanalyse
  - Pfad: `C:\Users\Administrator\CodeSpace\.geminicli\geminicli.exe`
  - Beschreibung: Kommandozeilen-Tool zur Analyse von Bildern und Generierung von Berichten
  - Verwendung: `geminicli.exe --media "bild_pfad" "analyse_prompt"`
  - README: `C:\Users\Administrator\CodeSpace\.geminicli\README.md`
- **Allgemeine Analyse**: "Führe eine detaillierte Analyse des UI/UX-Designs, Layouts und der Benutzerfreundlichkeit durch."
- **Komponenten-spezifisch**: "Analysiere die Icons, Buttons und Navigationselemente auf Konsistenz und Klarheit."
- **Verbesserungsvorschläge**: "Schlage Verbesserungen für eine bessere Benutzererfahrung und Barrierefreiheit vor."
- **Ausführung**:
  - Befehl: `geminicli.exe --media "bild_pfad" "analyse_prompt"`
  - Liefert detaillierte visuelle Beschreibungen und Bewertungen
- **Datei-Überprüfung**: Überprüfen Sie Dateiexistenz und -größe vor der Analyse

#### 9.4 Analyse-Prozess

- Führen Sie den Gemini CLI-Befehl mit dem entsprechenden Bildpfad und Prompt aus
- Erfassen und protokollieren Sie die Ausgabe zur Überprüfung
- Bei Analysefehlern mit alternativen Prompts erneut versuchen oder Bildintegrität überprüfen

#### 9.5 Dokumentation

- Kompilieren Sie Analyseergebnisse in strukturierte Dokumentation
- Heben Sie wichtige Erkenntnisse und umsetzbare Vorschläge hervor
- Verwenden Sie Markdown-Formatierung für Klarheit und Organisation

### 10. Automatische Kontext-Updates

Bei der Arbeit an diesem Projekt sollten neue Informationen, Tools oder Entwicklungspraktiken automatisch in dieser Datei dokumentiert werden, um einen umfassenden Projektkontext zu erhalten. Dies stellt sicher, dass:

1. **Wissenspersistenz**: Wichtige Informationen werden über Sitzungen hinweg erhalten
2. **Teamzusammenarbeit**: Alle Teammitglieder haben Zugang zum gleichen Kontext
3. **Projektentwicklung**: Dokumentation entwickelt sich mit dem Projekt weiter
4. **Bewährte Praktiken**: Entwicklungsrichtlinien werden kontinuierlich aktualisiert

**Wann diese Datei aktualisiert werden sollte**:

- Nach dem Erlernen neuer Tools oder Technologien, die im Projekt verwendet werden
- Bei der Entdeckung wichtiger projektspezifischer Konfigurationen oder Workflows
- Nach der Implementierung signifikanter Features oder architektonischer Änderungen
- Bei der Identifizierung nützlicher Entwicklungsmuster oder -praktiken

**Wie aktualisiert wird**:

- Fügen Sie neue Abschnitte für verschiedene Informationskategorien hinzu
- Halten Sie Informationen organisiert und leicht scannbar
- Verwenden Sie Markdown-Formatierung für Klarheit
- Aktualisieren Sie bestehende Abschnitte bei Informationsänderungen
- Falls Aktualisierungen umfangreich sind, sollten Sie in Erwägung ziehen, dazu eine separate Dokumentationsdatei in `docs/` zu erstellen und hier darauf zu verweisen

## Ressourcen

- Supabase Docs: <https://supabase.com/docs>
- Mantine Docs: <https://mantine.dev>
- Vitest Docs: <https://vitest.dev>
- ESLint Docs: <https://eslint.org>
- Projekt-Repo: <https://github.com/randanplan/psa-manager>
- Gemini CLI Tool: <https://gitlab.com/ai-gimlab/geminicli>
- Vercel Cloud URL: <https://vercel.com/randanplans-projects/psa-manager>
