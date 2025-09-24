# PSA-Manager Dokumentation

## Überblick

Die PSA-Manager Web-Anwendung dient der Digitalisierung und Vereinfachung von Prüfungen der Persönlichen Schutzausrüstung (PSA) gegen Absturz gemäß BGR 198/199. Sie ersetzt ein manuelles, fehleranfälliges Excel-basiertes System, indem sie Prüfberichte zentralisiert, automatisiert und kollaborativ verwaltet. Mehrere PSA-Sachkundige können die App nutzen, um Prüfungen zu erstellen, zu bearbeiten, zu exportieren (PDF/Excel) und PSA-Gegenstände über QR-Codes zu verfolgen.

Diese Dokumentation beschreibt die Installation, Projektstruktur, Datenmodelle, Kernfunktionen und Erweiterungsmöglichkeiten. Sie ist für Entwickler und Coding-Agents (z. B. GitHub Copilot) gedacht, um die Entwicklung und Wartung zu unterstützen.

## Inhaltsverzeichnis

- [Lokales Setup](setup-local.md)
- [Cloud-Setup](setup-cloud.md)
- [Anleitung für Coding-Agents](AGENTS.md)
- [Projektstruktur](structure.md)
- [Datenmodelle](data-models.md)
- [Kernfunktionen](features.md)
- [Testing und Linting](testing-and-linting.md)
- [Erweiterungen und Zukunft](roadmap.md)
- [Fehlerbehebung](troubleshooting.md)

## Schnellstart

1. **Repo klonen**: `git clone https://github.com/randanplan/psa-manager.git`
2. **Abhängigkeiten installieren**: `npm install`
3. **Umgebungsvariablen**: Kopiere `.env.example` zu `.env.local` und füge Supabase-Schlüssel hinzu (siehe [setup-local.md](setup-local.md) für lokale Entwicklung oder [setup-cloud.md](setup-cloud.md) für Cloud-Deployment).
4. **Entwicklungsserver starten**: `npm run dev`
5. **Zugriff**: Öffne `http://localhost:5173` im Browser.

Weitere Details in den jeweiligen Abschnitten.
