# Projektstruktur

Die Struktur des PSA-Manager-Projekts ist modular aufgebaut, um Wartung und Erweiterung zu erleichtern. Hier ist eine Übersicht:

```text
psa-manager/
├── docs/                    # Dokumentation (diese Dateien)
├── public/                  # Statische Assets (z. B. favicon)
├── src/
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── ReportForm.tsx   # Formular für neue/editierte Berichte
│   │   ├── ItemTable.tsx    # Tabelle für PSA-Gegenstände
│   │   └── ...              # Weitere Komponenten
│   ├── pages/               # Seiten (React Router)
│   │   ├── Dashboard.tsx    # Liste aller Berichte
│   │   ├── ReportView.tsx   # Detailansicht eines Berichts
│   │   ├── ReportEdit.tsx   # Bearbeitungsseite für Berichte
│   │   └── ...              # Weitere Seiten
│   ├── types/               # TypeScript-Interfaces
│   │   ├── index.ts         # PsaReport, PsaReportItem
│   ├── lib/                 # Utility-Funktionen
│   │   ├── supabase.ts      # Supabase-Client-Initialisierung
│   ├── store/               # Zustand-Stores
│   │   ├── auth.ts          # Auth-Status und User-Info
│   │   ├── reports.ts       # Berichte und Filter
│   ├── App.tsx              # Hauptkomponente mit Router
│   ├── main.tsx             # Einstiegspunkt
│   └── index.css            # Globale Styles (Mantine)
├── .env.example             # Vorlage für Umgebungsvariablen
├── .env.local               # Lokale Umgebungsvariablen (nicht versioniert)
├── vite.config.ts           # Vite-Konfiguration
├── package.json             # Abhängigkeiten und Skripte
└── README.md                # Projektübersicht
```

## Wichtige Dateien

- **src/types/index.ts**: Definiert `PsaReport` und `PsaReportItem` (siehe [data-models.md](data-models.md)).
- **src/lib/supabase.ts**: Initialisiert den Supabase-Client mit URL und anon-key.
- **src/components/ReportForm.tsx**: Hauptformular für die Eingabe von Prüfdaten, inkl. Tabelle für `items` und Validierung mit `@mantine/form`.
- **src/pages/Dashboard.tsx**: Listet Berichte mit Filtern (Anwender, Jahr) und Suchfunktion.
