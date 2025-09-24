# Kernfunktionen

Die PSA-Manager App unterstützt folgende Kernfunktionen, die das manuelle Excel-System ersetzen:

## 1. Authentifizierung

- Nutzt Supabase Auth (Email/Passwort oder OAuth, z. B. Google).
- Jeder Prüfer hat eine UID, gespeichert in `createdBy`/`updatedBy`.
- Row-Level-Security (RLS) in Supabase: Nur authentifizierte Nutzer können Berichte sehen/ändern.

## 2. Berichte verwalten

- **Dashboard**: Listet alle Berichte (`psa_reports`), filterbar nach `anwender` oder Jahr (`datum`).
- **Neuer Bericht**: Formular (`ReportForm.tsx`) zum Erstellen eines Berichts:
  - Eingabe von `anwender`, `prueferName`, `ort`, `datum`.
  - Tabelle für `items` (mit `@mantine/form` für Validierung).
  - Automatische Vorbefüllung: Lädt `items` aus der letzten Prüfung des Anwenders und setzt Felder wie `zustand` zurück.
  - Suche nach `itemSN`, um bestehende Gegenstände aus der DB zu laden.
- **Bearbeiten/Ansicht**: Berichte können bearbeitet oder nur angezeigt werden.

## 3. Excel/CSV-Import

- Import von alten Excel-Dateien (mit `xlsx`).
- Workflow: Nutzer lädt Datei hoch, App parst sie in `PsaReport`-Format und speichert in Supabase.
- Dateinamen (z. B. "2022_PSA_Natalie.xlsx") werden analysiert, um `anwender` zu extrahieren.

## 4. PDF/Excel-Export

- **PDF**: Mit `jspdf` und `autotable`. Rendert Kopf (Titel, Anwender), Tabelle (`items`), Fuß (Erklärung, Ort/Datum/Unterschrift-Platzhalter).
- **Excel**: Mit `xlsx`. Exportiert Bericht als XLSX-Datei, analog zur alten Struktur.

## 5. QR-Code-Generierung

- Für jedes `PsaReportItem`: Generiert QR-Code mit `qrcode.react`, der auf `itemSN` und eine URL (z. B. `/items/:sn`) verweist.
- Nutzung: Scannen zeigt die Prüfhistorie des Gegenstands.

## 6. Automatisierung

- **Vorjahresdaten**: Beim Erstellen eines neuen Berichts für einen Anwender werden `items` aus der letzten Prüfung geladen, ohne manuelles Kopieren.
- **Validierung**: Pflichtfelder (z. B. `itemSN`) werden geprüft.
- **Auto-Save**: Entwürfe werden mit Zustand zwischengespeichert.
