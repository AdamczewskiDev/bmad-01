#!/usr/bin/env markdown
# Test Design — b-home (system-level draft)

## Cele
- Zweryfikować fundamenty: auth, portfele/uprawnienia, kategorie, transakcje z FX, raporty cache, audyt/metryki.
- Uwzględnić integracje PSD2 w kolejnym sprincie (scenariusze już zarysowane).

## Ryzyka testowe
- Integracje bankowe (PSD2): niestabilność API, timeouty, zmienny payload.
- Uprawnienia portfela: wycieki danych/edycji między użytkownikami.
- FX: brak lub opóźnione kursy, błędny fallback, przeliczenia historyczne.
- Cache raportów: dane nieodświeżone po CRUD/importach.
- Dane finansowe: bezpieczeństwo i poprawność (double-entry edge cases).

## Zakres (v1)
- Auth/Session: rejestracja/logowanie/reset, rate-limit, błędne dane.
- Portfele/Uprawnienia: CRUD, zaproszenia, role, egzekucja „own-only” vs „can edit all”.
- Kategorie: seed, CRUD własnych, przepięcie przy usuwaniu.
- Transakcje: CRUD, waluty, przeliczenia FX, szybkie dodawanie wielu.
- FX: scheduler 12:00, fallback, użycie kursu z booked_at.
- Raporty (minimalne): wydatki w czasie, podział na kategorie, postęp celów, cache invalidation.
- Observability: audit log wpisy, metryki, healthcheck.

## Scenariusze kluczowe (happy path)
- Auth: rejestracja → login → refresh → reset hasła (token ważny, link jednokrotnego użycia).
- Portfel: utworzenie portfela (PLN/EUR/USD), edycja limitu/celu, usunięcie z potwierdzeniem.
- Zaproszenia: wysłanie, przyjęcie, rola domyślna own-only, toggle „can edit all”.
- Transakcja ręczna: dodanie wydatku z kategorią, waluta ≠ bazowa → przeliczenie po kursie z booked_at.
- Kategorie: dodanie własnej, edycja, usunięcie z przepięciem transakcji.
- Raport: po dodaniu transakcji widać ją w raporcie; po usunięciu/edycji cache odświeżony.
- FX: scheduler zapisuje kursy, przeliczenie używa właściwego kursu, fallback gdy brak kursu z dnia.
- Audyt: wpis dla CRUD portfela, zaproszeń, transakcji, zmiany uprawnień; metryki i healthcheck dostępne.

## Scenariusze błędów/edge
- Auth: zły email/hasło; konto nieaktywne; nadmiar prób → throttling.
- Zaproszenia: przyjęcie wygasłego/odwołanego; ponowne użycie linku.
- Uprawnienia: współużytkownik próbuje edytować cudzą transakcję przy own-only (oczekiwany 403); z „can edit all” — dozwolone.
- FX: brak kursu z dnia (weekend) → fallback do poprzedniego; kurs niezaładowany (scheduler fail) → komunikat/ponowna próba.
- Raporty: cache nieodświeżone po edycji/usunięciu transakcji; test invalidacji.
- Kategorie: usunięcie kategorii używanej → wymuszony wybór kategorii docelowej.
- Dane bankowe (przyszłe PSD2): timeout, 429, partial import, zły mapping kategorii → możliwość ręcznej korekty.

## Dane testowe
- Użytkownicy: owner@test, member@test.
- Portfele: PLN z limitem, EUR bez limitu.
- Kategorie: domyślne + custom „Hobby”.
- Transakcje: 3 wydatki (PLN, EUR, USD) i 1 przychód; daty obejmujące weekend (sprawdzenie kursów).

## Kryteria akceptacji (skrót)
- Uprawnienia respektują own-only / can-edit-all.
- Wszystkie CRUD-y logują wpis audit.
- Raporty odświeżają się po zmianach (cache invalidation).
- FX przelicza po kursie z daty lub poprawnie fallbackuje.
- Auth zabezpieczony rate-limit i poprawną obsługą resetu.
