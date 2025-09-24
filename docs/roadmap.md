# Erweiterungen und Zukunft

Die PSA-Manager App kann durch folgende Features erweitert werden:

1. **Benachrichtigungen**: Erinnerungen für fällige Prüfungen basierend auf `naechstePruefung` (z. B. via Supabase Edge Functions und E-Mail).
2. **Mobile-Optimierung**: Verbesserte UI für Prüfungen vor Ort (z. B. via Smartphone).
3. **Bild-Uploads**: Speicherung von Fotos zu PSA-Gegenständen in Supabase Storage (z. B. für `zustand`-Dokumentation).
4. **Historie**: Detailansicht für die Prüfhistorie eines Gegenstands (`itemSN`) über alle Berichte.
5. **Mehrsprachigkeit**: Unterstützung für EN/DE mit `i18next`.
6. **Statistiken**: Dashboard mit Metriken (z. B. Anzahl Prüfungen pro Jahr, häufigste `ergebnis`-Werte).

Entwickler können diese Features in neuen Pull Requests umsetzen. Coding-Agents sollten die bestehenden Datenmodelle und Komponenten nutzen, um Konsistenz zu wahren.
