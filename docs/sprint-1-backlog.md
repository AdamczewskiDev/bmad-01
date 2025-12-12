#!/usr/bin/env markdown
# Sprint 1 Backlog — b-home (fundamenty)

## Cele sprintu
- Postawić fundamenty: auth, portfele/uprawnienia, kategorie, transakcje ręczne z FX, przygotować cache raportów.
- Dostarczyć działający core bez integracji PSD2 (te w nast. sprincie).

## Zadania (propozycja)
Kolejność sugerowana (zależności): Auth → Portfele/Uprawnienia → Kategorie → Transakcje + FX → Cache raportów → Observability. FE równolegle po dostępności API.

### Auth i konta
- [BE][M][MUST] Rejestracja/logowanie/reset (email+hasło), throttling, walidacja haseł, komunikaty błędów.
- [BE][S][MUST] Tokeny sesji/refresh (JWT lub http-only cookies) + middleware auth.
- [FE][S][MUST] Formularze: rejestracja/logowanie/reset + obsługa błędów.

### Portfele i uprawnienia
- [BE][M][MUST] CRUD portfela (nazwa, waluta bazowa, limit/goal; waluta niezmienna po utworzeniu).
- [BE][M][MUST] Zaproszenia do portfela: generacja, statusy, przyjęcie/odrzucenie.
- [BE][M][MUST] Uprawnienia: domyślnie „own-only”, toggle właściciela „can edit all”; egzekucja w middleware/handlerach.
- [BE][S][MUST] Lista członków, zmiana roli/uprawnień, usunięcie członka; wpis do audit_log.
- [FE][M][MUST] UI portfeli: lista, szczegóły, zaproszenia, zarządzanie członkami/uprawnieniami.

### Kategorie
- [BE][S][MUST] Seed zestawu startowego (income/expense) nieusuwalnego.
- [BE][S][MUST] CRUD kategorii własnych; przy usunięciu własnej — przepięcie transakcji do innej.
- [FE][S][MUST] UI kategorii: lista, dodawanie/edycja/usuwanie, komunikaty przy przepięciu.

### Transakcje ręczne
- [BE][M][MUST] CRUD transakcji (przychód/wydatek, kategoria, notatka, data, waluta); walidacja pól.
- [BE][M][MUST] Przeliczenie do waluty portfela (kurs NBP z booked_at; fallback do ostatniego).
- [FE][M][MUST] Formularz transakcji + tryb szybkiego dodawania wielu (zachowanie ostatnich wyborów).

### FX
- [BE][S][MUST] Scheduler 12:00 pobiera kursy NBP (EUR/USD) → fx_rates; loguje błędy, retry.
- [BE][S][MUST] Użycie kursu z booked_at w przeliczeniach; fallback do ostatniego dostępnego.
- [BE][XS][STRETCH] Endpoint serwisowy do wglądu w ostatnie kursy (diagnostycznie).

### Cache raportów (przygotowanie)
- [BE][M][MUST] Cache per dzień/portfel; invalidacja przy CRUD transakcji.
- [BE][M][MUST] Endpointy raportowe (minimalne): wydatki w czasie, podział na kategorie, postęp celów (na danych z CRUD).
- [FE][M][STRETCH] Prosty dashboard/raporty (lista/wykresy light) z filtrami podstawowymi.

### Observability i bezpieczeństwo
- [BE][S][MUST] Audit log: operacje na portfelach/transakcjach/uprawnieniach, status zaproszeń.
- [BE][S][MUST] Metryki: błędy API, latency, scheduler FX; healthcheck endpoint.
- [BE][S][MUST] Podstawowe zabezpieczenia: rate limiting na auth/CRUD transakcji, nagłówki bezpieczeństwa.

## Must-have w Sprint 1
- Auth (BE/FE), Portfele/Uprawnienia (BE min., FE podstawy), Kategorie (seed + CRUD), Transakcje (CRUD + FX przeliczenie), FX scheduler, podstawowe cache raportów + invalidacja, audit log/metryki/ratelimit.

## Nice-to-have / stretch
- FE dashboard/raporty z wykresami (light).
- Tryb szybkiego dodawania wielu transakcji (jeśli czas).
- Endpoint podglądu kursów (diag).

## Kryteria zakończenia sprintu (DoD)
- Działający login/rejestracja/reset + ochrona endpointów.
- Możliwość utworzenia portfela, zaproszenia użytkownika, zarządzania uprawnieniami.
- Transakcje ręczne z kategoriami i przeliczeniem FX; podstawowy zestaw kategorii.
- FX scheduler działa i przeliczenia używają kursów z daty.
- Cache raportów technicznie gotowe i działa invalidacja (nawet jeśli UI raportów jest prosty).
- Audit log rejestruje kluczowe akcje; metryki podstawowe zbierane.

## Wyłączenia w Sprint 1
- Integracje PSD2 (mBank/Santander) — następny sprint.
- Zaawansowane raporty/UX — rozwijane później na bazie fundamentów.
