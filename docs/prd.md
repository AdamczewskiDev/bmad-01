#!/usr/bin/env markdown
---
title: "PRD - b-home"
author: "Damian"
date: "2025-12-11"
---

# Product Requirements Document — b-home

## 1. Cel i kontekst
- Aplikacja web + mobile do zarządzania budżetem domowym.
- Współdzielone portfele z zapraszaniem innych użytkowników.
- Automatyzacja przez import transakcji z banków (start: mBank, Santander).

## 2. Użytkownicy i role
- Konto indywidualne dla każdej osoby.
- Role w portfelu: właściciel (pełne uprawnienia) + współużytkownicy (dodawanie/edycja transakcji, podgląd; konfiguracja wg właściciela).
- Grupa testowa: znajomi (early adopters).

## 3. Wartość (Value Proposition)
- Szybkie rejestrowanie i kategoryzacja transakcji (ręcznie i z importu).
- Wiele portfeli/celów (np. wakacje, fundusz awaryjny) z podglądem postępu.
- Czytelne wykresy i podsumowania pozwalające zidentyfikować główne drivery wydatków.
- Współdzielenie portfela w ramach gospodarstwa domowego.
- Integracje bankowe redukujące ręczne wprowadzanie.

## 4. Zakres funkcjonalny (in-scope)
- Rejestracja/logowanie użytkownika.
- Portfele/cel: tworzenie, edycja, usuwanie; przypisywanie użytkowników; limity/cele kwotowe.
- Transakcje: dodawanie, edycja, usuwanie; przychody i wydatki; notatki.
- Kategorie: zestaw startowy + własne; edycja/usuwanie własnych.
- Integracje bankowe: import transakcji mBank/Santander; mapowanie/kategoryzacja; podgląd statusu importu.
- Raporty i wizualizacje: wykresy (czas, kategorie, postęp celów), szybkie filtry.
- Uprawnienia: właściciel definiuje uprawnienia współużytkowników (min. dodawanie/edycja/podgląd).
- Wielowalutowość: PLN, EUR, USD; przeliczanie do waluty portfela (kurs NBP/ECB).

## 5. Poza zakresem (out-of-scope v1)
- Płatności/wykonywanie przelewów.
- Zaawansowane automaty reguł kategoryzacji (poza podstawowym mapowaniem z importu).
- Integracje z innymi bankami poza mBank/Santander.
- Publiczne udostępnianie danych/portfeli.

## 6. Wymagania funkcjonalne (high-level FR)
- FR1: Zarządzanie kontem użytkownika (rejestracja, logowanie, reset hasła).
- FR2: Zarządzanie portfelami/celami (CRUD, przypisywanie użytkowników, ustawianie waluty i limitu/celu).
- FR3: Transakcje (CRUD, typ: przychód/wydatek, kategorie, notatki, waluta transakcji, przeliczenie).
- FR4: Kategorie (predefiniowane + użytkownika; hierarchia prosta; edycja/usuwanie własnych).
- FR5: Integracje bankowe (autoryzacja, import, mapowanie, podgląd statusu; mBank, Santander).
- FR6: Raporty/wykresy (czas, kategorie, postęp celów, filtry po portfelu/użytkowniku/zakresie dat).
- FR7: Uprawnienia w portfelu (właściciel nadaje zakres: podgląd, dodawanie/edycja; domyślnie współużytkownik może dodawać/edytować swoje).
- FR8: Powiadomienia (opcjonalne v1: status importu, przekroczenie limitu, zbliżenie do celu).

## 7. Wymagania niefunkcjonalne (NFR)
- Bezpieczeństwo: TLS, szyfrowanie haseł (bcrypt/argon2), szyfrowanie wrażliwych tokenów integracji; kontrola dostępu per portfel.
- Prywatność: minimalny zakres przechowywanych danych finansowych; możliwość usunięcia portfela i danych transakcji.
- Wydajność: import transakcji do 2k pozycji w <10 s; dashboard w <2 s dla 12 miesięcy historii.
- Niezawodność: obsługa błędów integracji (time-out, brak połączenia, odświeżenie zgód).
- Użyteczność: priorytet na konfigurację/rozszerzalność nad maksymalną prostotę; jasne stany ładowania/importu.
- Zgodność: PSD2/rynki UE (dla integracji bankowych).

## 8. Integracje bankowe (start)
- Banki: mBank, Santander.
- Autoryzacja: zgodna z PSD2; ważność zgody i odświeżanie.
- Import: historia 90 dni przy pierwszym podpięciu + przyrostowo; mapowanie kategorii; oznaczenie źródła transakcji.

## 9. UX priorytety
- Konfigurowalność: użytkownik może dodać własne kategorie, portfele, cele, przeliczać waluty.
- Przepływ dodawania transakcji: szybki formularz + tryb „dodaj kilka pod rząd”.
- Czytelne wykresy i filtry; wyraźne stany podczas importu bankowego.

## 10. Miary sukcesu
- Satysfakcja grupy testowej (subiektywna ocena).
- Czas dodania transakcji (target: krótki przepływ).
- Udział transakcji importowanych z banków vs. ręcznie dodanych.
- Odsetek transakcji poprawnie skategoryzowanych.

## 11. Ryzyka
- Dostępność i stabilność API PSD2 (mBank/Santander).
- Bezpieczeństwo/prywatność danych finansowych.
- Dokładność kategoryzacji przy imporcie (zaufanie do aplikacji).
- Złożoność interfejsu przy dużej konfiguracji (ryzyko obniżenia UX).

## 12. Otwarte kwestie / decyzje do podjęcia
- (zamknięte) Zakres historii importu: 90 dni przy pierwszym podpięciu banku.
- (zamknięte) Szczegóły ról współużytkownika: może usuwać/edytować tylko swoje transakcje; właściciel może to zmienić w ustawieniach portfela.
- (zamknięte) Mechanizm kursów walut: NBP, aktualizacja raz dziennie o 12:00.
- (ustalone) Retencja/logi: dane transakcji trzymane do usunięcia przez użytkownika; logi/audit zdarzeń (dostępy, importy, zmiany) przechowywane 12 miesięcy; tokeny integracji bezpiecznie przechowywane i usuwane przy revokacji/wygaśnięciu.
