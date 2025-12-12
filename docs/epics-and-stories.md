#!/usr/bin/env markdown
# Epics & Stories — b-home (draft)

## Epic 1: Onboarding i konta użytkowników
- Story: rejestracja/logowanie, reset hasła.
-   AC: email+hasło; walidacja; throttling; link resetu; wymagaj silnego hasła; komunikaty o błędach.
- Story: tworzenie pierwszego portfela po rejestracji (wizard).
-   AC: wybór waluty bazowej (PLN/EUR/USD); nazwa portfela; opcjonalny limit/cel; skip dostępny.

## Epic 2: Portfele i uprawnienia
- Story: CRUD portfela (nazwa, waluta bazowa PLN/EUR/USD, limit/goal).
-   AC: waluta bazowa niezmienna po utworzeniu; edycja nazwy/limitów; usunięcie portfela wymaga potwierdzenia.
- Story: zapraszanie współużytkowników; role i uprawnienia (domyślnie edycja własnych transakcji, właściciel może rozszerzyć).
-   AC: zaproszenie e-mail/link; przyjęcie/odrzucenie; podgląd statusu zaproszeń; domyślne uprawnienia „own-only”, toggle „can edit all”.
- Story: przegląd członków i zarządzanie dostępami.
-   AC: lista członków z rolą/uprawnieniami; zmiana roli/uprawnień; usunięcie członka; audyt wpisu.

## Epic 3: Kategorie i konfiguracja
- Story: zestaw startowy kategorii (income/expense) + możliwość dodawania własnych.
-   AC: domyślne kategorie nieusuwalne; użytkownik może dodać/edytować własne; typ income/expense wymagany.
- Story: edycja/usuwanie kategorii własnych; ochrona kategorii domyślnych.
-   AC: nie można usunąć kategorii domyślnej; przy usunięciu kategorii własnej zaproponuj przeniesienie transakcji do innej.

## Epic 4: Transakcje ręczne
- Story: dodawanie/edycja/usuwanie transakcji (przychód/wydatek, kategoria, notatka).
-   AC: wymagane pola: kwota, typ, portfel, data; opcjonalnie notatka; walidacja znaków; undo/confirm przy usuwaniu.
- Story: waluty transakcji i przeliczenie do waluty portfela (kurs NBP z dnia).
-   AC: pokazana waluta transakcji i przeliczenie do bazowej; użycie kursu z booked_at (fallback do ostatniego).
- Story: szybkie dodawanie wielu transakcji pod rząd.
-   AC: skrót klawiaturowy / tryb „dodaj kolejną”; zachowanie ostatnich wyborów (kategoria/portfel) opcjonalnie.

## Epic 5: Integracje bankowe (PSD2)
- Story: podpięcie mBank/Santander (consent, status).
-   AC: stan podpięcia (aktywne/wygasa/wygasłe); odśwież zgody; błąd z komunikatem przy odmowie/timeout.
- Story: import historii 90 dni na start, potem przyrostowo; podgląd postępu i błędów.
-   AC: progres importu; licznik zaimportowanych; log błędów; ponów import pojedynczej sesji.
- Story: mapowanie kategorii (prosty mapping) i wskazanie portfela docelowego.
-   AC: UI do wyboru portfela; mapowanie nazwa handlowa → kategoria; możliwość ręcznej korekty po imporcie.
- Story: retry/backoff przy błędach banku.
-   AC: automatyczny retry z backoff; komunikat o stanie; limit prób; zapis w audit log.

## Epic 6: Raporty i dashboard
- Story: wykres wydatków w czasie (filtry: portfel, kategoria, użytkownik, zakres dat).
- Story: podział wydatków/przychodów na kategorie.
- Story: postęp celów/portfeli.
- Story: cache raportów per dzień/portfel (invalidacja po imporcie/edycji).

## Epic 7: Wielowalutowość i FX
- Story: scheduler kursów NBP (12:00), przechowywanie w fx_rates.
-   AC: harmonogram 12:00; zapis kursów dla PLN/EUR/USD; monitoring błędów; retry.
- Story: przeliczenia transakcji do waluty portfela wg kursu z daty booked_at.
-   AC: wykorzystaj kurs z daty; fallback do ostatniego; przechowuj amount_base.
- Story: fallback do ostatniego dostępnego kursu.

## Epic 8: Powiadomienia (light v1)
- Story: powiadomienia o statusie importu (sukces/błąd).
- Story: alerty o przekroczeniu limitu lub zbliżeniu do celu (na portfel).

## Epic 9: Audyt i retencja
- Story: logowanie akcji (importy, zmiany uprawnień, CRUD transakcji/portfeli).
- Story: retencja logów 12 miesięcy; usuwanie tokenów integracji przy revokacji/wygaśnięciu.

## Epic 10: UX i wydajność
- Story: stany ładowania/importu, błędów, retry; skeletony dla dashboardu.
- Story: optymalizacje UI dla dodawania transakcji (mało kliknięć, focus na polach).

## Notatki
- Priorytety wykonawcze: start od Epic 1–5 (fundamenty + integracje), równolegle Epic 7 (FX) jeśli backend ma kursy. Raporty (Epic 6) po dostępności danych. Powiadomienia i audyt po stabilizacji CRUD/importów.
