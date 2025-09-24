# PSA-Manager

Ein modernes Web-Tool für das Management und die Digitalisierung von PSA (Persönliche Schutzausrüstung) Prüfungen basierend auf BGR 198/199 Standards.

## 🚀 Features

- **Moderne Technologien**: React v19, TypeScript, Vite, Mantine v8
- **Benutzerauthentifizierung**: Sichere Authentifizierung mit Supabase
- **PSA-Berichtsverwaltung**: Erstellen, bearbeiten und verwalten von PSA-Prüfberichten
- **Datenmodelle**: Strukturierte Erfassung von PSA-Items mit allen relevanten Informationen
- **Export-Funktionen**: PDF und Excel Export für Berichte
- **QR-Code Integration**: QR-Codes für jede Seriennummer
- **Responsives Design**: Optimiert für Desktop und mobile Geräte
- **Suchfunktionen**: Durchsuchbare Berichte nach Anwender, Jahr und mehr

## 🛠️ Tech Stack

- **Frontend**: React v19 mit TypeScript
- **Build Tool**: Vite
- **UI Framework**: Mantine v8 (Core, Form, Dates, Notifications, Hooks)
- **Routing**: React Router
- **State Management**: Zustand
- **Backend & Database**: Supabase (Auth, Database, Storage)
- **Export**: jsPDF, XLSX (SheetJS)
- **QR Codes**: qrcode.react
- **Date Handling**: dayjs

## 📋 Voraussetzungen

- Node.js (>= 18.0.0)
- npm oder yarn
- Supabase Account

## 🔧 Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/randanplan/psa-manager.git
   cd psa-manager
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env
   ```
   
   Bearbeiten Sie die `.env` Datei und fügen Sie Ihre Supabase-Konfiguration hinzu:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Supabase Datenbank einrichten**
   
   Erstellen Sie in Ihrem Supabase-Projekt eine Tabelle `psa_reports`:
   ```sql
   CREATE TABLE psa_reports (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     anwender TEXT NOT NULL,
     prueferName TEXT,
     ort TEXT,
     datum DATE NOT NULL,
     items JSONB NOT NULL DEFAULT '[]',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_by UUID REFERENCES auth.users(id),
     updated_by UUID REFERENCES auth.users(id)
   );
   
   -- Row Level Security aktivieren
   ALTER TABLE psa_reports ENABLE ROW LEVEL SECURITY;
   
   -- Policy für authentifizierte Benutzer
   CREATE POLICY "Users can view their own reports" ON psa_reports
     FOR SELECT USING (auth.uid() = created_by);
   
   CREATE POLICY "Users can insert their own reports" ON psa_reports
     FOR INSERT WITH CHECK (auth.uid() = created_by);
   
   CREATE POLICY "Users can update their own reports" ON psa_reports
     FOR UPDATE USING (auth.uid() = created_by);
   
   CREATE POLICY "Users can delete their own reports" ON psa_reports
     FOR DELETE USING (auth.uid() = created_by);
   ```

5. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   
   Die Anwendung ist unter `http://localhost:5173` verfügbar.

## 📖 Verwendung

### Erste Schritte

1. **Account erstellen**: Registrieren Sie sich mit Ihrer E-Mail-Adresse
2. **Ersten Bericht erstellen**: Klicken Sie auf "Neuer Bericht"
3. **PSA-Items hinzufügen**: Fügen Sie PSA-Items mit allen relevanten Informationen hinzu
4. **Bericht speichern**: Speichern Sie den vollständigen Bericht

### Datenmodelle

#### PsaReportItem
```typescript
interface PsaReportItem {
  index?: number;
  itemDescription: string;      // Beschreibung des PSA-Items
  enNorm: string;              // EN-Norm (z.B. EN 397)
  itemSN: string;              // Seriennummer
  baujahr: number;             // Herstellungsjahr
  zustand: string;             // Aktueller Zustand
  ergebnis: "GUT" | "BEOBACHTEN" | "REPARIEREN" | "AUSSONDERN";
  naechstePruefung: string | Date; // Datum der nächsten Prüfung
}
```

#### PsaReport
```typescript
interface PsaReport {
  id: string;
  anwender: string;            // Name des PSA-Anwenders
  prueferName?: string;        // Name des Prüfers
  ort?: string;                // Prüfungsort
  datum: string | Date;        // Prüfungsdatum
  items: PsaReportItem[];      // Array der PSA-Items
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
}
```

### Features im Detail

- **Dashboard**: Übersicht aller Berichte, suchbar nach Anwender oder Jahr
- **Berichterstellung**: Formulare für neue und bestehende Berichte
- **Item-Verwaltung**: Tabelle zum Hinzufügen/Bearbeiten von PSA-Items
- **QR-Codes**: Automatische QR-Code-Generierung für Seriennummern
- **Export**: PDF und Excel Export für Berichte
- **Responsive Design**: Funktioniert auf allen Geräten

## 🔨 Entwicklung

### Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build

# Lint Code
npm run lint

# Preview der Produktion
npm run preview
```

### Projekt-Struktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ReportForm.tsx   # Formular für Berichte
│   └── ItemTable.tsx    # Tabelle für PSA-Items
├── pages/               # Seiten-Komponenten
│   ├── Dashboard.tsx    # Hauptübersicht
│   ├── Login.tsx        # Authentifizierung
│   ├── NewReport.tsx    # Neuer Bericht
│   ├── EditReport.tsx   # Bericht bearbeiten
│   └── ViewReport.tsx   # Bericht anzeigen
├── types/               # TypeScript Typdefinitionen
│   ├── index.ts         # Haupt-Interfaces
│   └── supabase.ts      # Supabase-Typen
├── store/               # Zustand State Management
│   └── index.ts         # Auth und Report Stores
├── lib/                 # Utility-Bibliotheken
│   └── supabase.ts      # Supabase Client
└── App.tsx              # Haupt-App-Komponente
```

## 🔒 Sicherheit

- Row Level Security (RLS) aktiviert für alle Datenbank-Tabellen
- Benutzer können nur ihre eigenen Berichte sehen und bearbeiten
- Sichere Authentifizierung über Supabase Auth

## 📝 Standards

Die Anwendung folgt den BGR 198/199 Standards für PSA-Prüfungen und unterstützt:
- Strukturierte Erfassung aller prüfungsrelevanten Daten
- Nachverfolgbare Dokumentation
- Export-Funktionen für offizielle Berichte

## 🤝 Beitragen

1. Fork des Repositories
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe die [LICENSE](LICENSE) Datei für Details.

## ⚠️ Haftungsausschluss

Diese Software dient als Hilfsmittel für PSA-Prüfungen. Die Verantwortung für die ordnungsgemäße Durchführung von PSA-Prüfungen gemäß den geltenden Vorschriften liegt beim Anwender.
