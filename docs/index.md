# PSA-Manager Dokumentation

## Überblick

Die PSA-Manager Web-Anwendung dient der Digitalisierung und Vereinfachung von Prüfungen der Persönlichen Schutzausrüstung (PSA) gegen Absturz gemäß BGR 198/199. Sie ersetzt ein manuelles, fehleranfälliges Excel-basiertes System, indem sie Prüfberichte zentralisiert, automatisiert und kollaborativ verwaltet. Mehrere PSA-Sachkundige können die App nutzen, um Prüfungen zu erstellen, zu bearbeiten, zu exportieren (PDF/Excel) und PSA-Gegenstände über QR-Codes zu verfolgen.

Diese Dokumentation beschreibt die Installation, Projektstruktur, Datenmodelle, Kernfunktionen und Erweiterungsmöglichkeiten. Sie ist für Entwickler und Coding-Agents (z. B. GitHub Copilot) gedacht, um die Entwicklung und Wartung zu unterstützen.

## Inhaltsverzeichnis

- [Installation und Setup](setup.md)
- [Projektstruktur](structure.md)
- [Datenmodelle](data-models.md)
- [Kernfunktionen](features.md)
- [Erweiterungen und Zukunft](roadmap.md)
- [Fehlerbehebung](troubleshooting.md)

## Schnellstart

1. **Repo klonen**: `git clone https://github.com/randanplan/psa-manager.git`
2. **Abhängigkeiten installieren**: `npm install`
3. **Umgebungsvariablen**: Kopiere `.env.example` zu `.env.local` und füge Supabase-Schlüssel hinzu (siehe [setup.md](setup.md)).
4. **Entwicklungsserver starten**: `npm run dev`
5. **Zugriff**: Öffne `http://localhost:5173` im Browser.

Weitere Details in den jeweiligen Abschnitten.
