# Fehlerbehebung

## Häufige Probleme

1. **Supabase-Verbindung fehlschlägt**:

   - Prüfe `.env.local`: Sind `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` korrekt?
   - Stelle sicher, dass das Supabase-Projekt läuft und RLS-Policies konfiguriert sind.

2. **npm run dev startet nicht**:

   - Lösche `node_modules` und `package-lock.json`, dann `npm install`.
   - Prüfe Node.js-Version (mind. 18).

3. **Formularvalidierung fehlschlägt**:

   - Überprüfe `@mantine/form`-Regeln in `ReportForm.tsx`.
   - Stelle sicher, dass Pflichtfelder (z. B. `itemSN`) definiert sind.

4. **PDF-Export sieht falsch aus**:
   - Prüfe `jspdf` und `autotable` Versionen in `package.json`.
   - Teste mit kleinen `items`-Arrays, um Layout-Probleme zu finden.

## Logs und Debugging

- Nutze die Browser-DevTools (F12) für Frontend-Fehler.
- Supabase-Dashboard: Überprüfe Logs unter "Database > Query Performance" oder "Auth > Logs".
- Zustand-DevTools: Aktiviere in `src/store` für State-Debugging.

## Hilfe

- Erstelle ein Issue in der Repo: `https://github.com/randanplan/psa-manager/issues`
- Konsultiere die Supabase-Dokumentation: `https://supabase.com/docs`
- Mantine-Dokumentation: `https://mantine.dev`
