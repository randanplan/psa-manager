# Testing und Linting für PSA-Manager

Diese Dokumentation beschreibt die Einrichtung von **Vitest** (mit React Testing Library) für Tests und **ESLint** (mit Mantine-Konfiguration) für Linting in der PSA-Manager Web-Anwendung. Sie richtet sich an Entwickler und Coding-Agents (z. B. Qwen, Copilot), um konsistente Code-Qualität und Testbarkeit sicherzustellen. Die Anwendung nutzt React v19, TypeScript, Vite, Mantine v8 und Supabase.

Siehe auch `docs/index.md` und `docs/setup.md` für weiteren Kontext.

## 1. Vitest und React Testing Library

Vitest ist das Test-Framework für Vite-basierte Projekte. In Kombination mit React Testing Library ermöglicht es Unit-Tests für React-Komponenten, die Mantine v8 verwenden.

### Installation

Führe im Projekt-Root (`psa-manager/`) aus:

```bash
pnpm install --save-dev vitest jsdom @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event