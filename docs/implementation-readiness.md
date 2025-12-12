#!/usr/bin/env markdown
# Implementation Readiness — b-home (checklist)

## Stan artefaktów
- Product Brief: docs/product-brief.md
- PRD: docs/prd.md
- Architektura: docs/architecture.md
- Epiki/Stories: docs/epics-and-stories.md
- Sprint 1 backlog: docs/sprint-1-backlog.md (MUST/STRETCH, kolejność, BE/FE)
- Test Design: docs/test-design.md

## Gotowość (zielone)
- Zakres produktu opisany (PRD) i zweryfikowane value/ryzyka.
- Architektura wysokopoziomowa + model danych + przepływy (import PSD2 zarys, FX, uprawnienia).
- Epiki/Stories z AC dla kluczowych funkcji; Sprint 1 backlog z priorytetem MUST.
- Test-design: happy path + edge + dane testowe.

## Braki/ryzyka do zamknięcia
- UX szczegółowe: brak makiet/flow UI (zwłaszcza zaproszenia, transakcje, raporty). Ryzyko: rozjazd FE/BE.
- Raporty: brak wymagań dot. formatu eksportów/druków; brak precyzyjnych agregacji (na start OK, ale doprecyzować przed implementacją raportów).
- PSD2: szczegóły integracji (dostawca, sandbox, SLA, limity) — planowane na kolejny sprint.
- Bezpieczeństwo: polityka haseł, rotacja/retencja tokenów bankowych; monitoring alertów (nie tylko metryki).
- Dane produkcyjne: RODO/retencja dla pełnych danych finansowych (mamy wstępne założenia, ale brak polityki formalnej).

## Rekomendacje przed startem dev
- Uzgodnić minimalne flow UI (szkice/lo-fi) dla: portfel + zaproszenia, formularz transakcji (tryb szybki), raporty podstawowe.
- Potwierdzić strategie bezpieczeństwa: przechowywanie tokenów (KMS/secret store), rotacja, polityka haseł, rate limits docelowe.
- Przygotować dane testowe i fixture do automatyzacji (owner/member, portfele PLN/EUR, kategorie, transakcje weekend).
- Ustalić dostawcę PSD2/sandbox i wymagania (import 90 dni, refresh consent).

## Podsumowanie gotowości
- Można startować z implementacją Sprint 1 (fundamenty). Ryzyka głównie w UX szczegółowym i integracji PSD2 (następny sprint).
