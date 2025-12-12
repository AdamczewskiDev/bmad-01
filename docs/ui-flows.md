#!/usr/bin/env markdown
# UI Lo-Fi Flows — b-home (szybkie szkice)

## Flow 1: Portfel + zaproszenia
1) Lista portfeli: nazwa, waluta, saldo/limit, status (owner/member).
2) Szczegóły portfela:
   - Karta: saldo, limit/cel, waluta bazowa.
   - Członkowie: rola, uprawnienia (own-only / can edit all).
   - Przyciski: „Dodaj członka”, „Zmień uprawnienia”.
3) Dodaj członka:
   - Pole email.
   - Opcje: rola (member), uprawnienia (domyślnie own-only).
   - Wyślij zaproszenie → status „pending”.
4) Widok zaproszeń:
   - Lista: email, status (pending/accepted/declined/expired), przycisk „wyślij ponownie”/„odwołaj”.
5) Zmiana uprawnień:
   - Toggle can-edit-all.
   - Usunięcie członka → potwierdzenie.

## Flow 2: Transakcja (tryb szybki)
1) Formularz dodawania:
   - Kwota, waluta, typ (wydatek/przychód), kategoria, data, notatka (opcjonalnie), portfel.
   - Pokazuj przeliczenie do waluty portfela (kurs NBP z daty).
2) Akcja „Zapisz i dodaj kolejną”:
   - Zachowaj ostatni portfel/kategorię/typ (opcjonalnie).
   - Po zapisie formularz czyszczony z wyjątkiem zapamiętanych pól.
3) Edycja/usuwanie:
   - Edytuj transakcję → przeliczenie aktualizowane na kurs z daty (fallback do ostatniego).
   - Usuń → dialog potwierdzenia.

## Flow 3: Raporty (minimal)
1) Dashboard:
   - Filtry: portfel, zakres dat, kategoria, użytkownik.
   - Widżety: wydatki w czasie (line), podział na kategorie (pie/bar), postęp celów.
2) Cache/odświeżenie:
   - Po dodaniu/edycji/usunięciu transakcji pokazuj „odświeżanie danych…” i aktualizuj widżety.
   - Oznacz timestamp ostatniego przeliczenia.
3) Błędy:
   - Gdy brak danych/kursów → komunikat z możliwością retry.
   - Przy błędzie API raportu → toast + opcja ponów.

## ASCII szkice (lo-fi)

### Lista portfeli
```
-------------------------------------------------
| Portfele                                      |
-------------------------------------------------
| + Nowy portfel                                |
-------------------------------------------------
| [Owner] Domowy PLN      Saldo: 2 300 / Limit: 3 000 |
| [Member] Wyjazd EUR     Saldo: 450    / Cel: 1 200  |
-------------------------------------------------
```

### Szczegóły portfela (karta + członkowie)
```
-------------------------------------------------
| Domowy (PLN)                                   |
| Saldo: 2 300   Limit: 3 000   Cel: -          |
| [Dodaj członka] [Zmień uprawnienia]            |
-------------------------------------------------
| Członkowie                                     |
| - ty (owner)           uprawnienia: can edit all |
| - alice@example.com    uprawnienia: own-only     |
|   [zmień] [usuń]                                |
-------------------------------------------------
```

### Zaproszenie członka
```
-------------------------------------------------
| Dodaj członka                                  |
| Email: [____________________]                  |
| Rola: [member]                                 |
| Uprawnienia: ( ) own-only   ( ) can edit all   |
| [Wyślij]                                       |
-------------------------------------------------
```

### Transakcja (tryb szybki)
```
-------------------------------------------------
| Dodaj transakcję                               |
| Kwota: [   ]  Waluta: [PLN]  Typ: (•) Wydatek ( ) Przychód |
| Kategoria: [Jedzenie ▼]   Data: [2025-12-11]   |
| Portfel: [Domowy ▼]                            |
| Notatka: [....................]                |
| Przeliczenie: 43.20 EUR -> 190.50 PLN (NBP 2025-12-11) |
| [Zapisz] [Zapisz i dodaj kolejną]              |
-------------------------------------------------
| Lista (ostatnie):                              |
| - 120.00 PLN  Jedzenie  2025-12-10             |
| - 45.00 USD   Transport 2025-12-09 (przel. 178.50 PLN) |
-------------------------------------------------
```

### Dashboard raportów (mini)
```
-------------------------------------------------
| Raporty                                        |
| Filtry: Portfel [Domowy▼]  Zakres [30d▼]  Kat [Wszystkie▼] |
-------------------------------------------------
| Wydatki w czasie (line)      | Kategorie (pie/bar)        |
-------------------------------------------------
| Postęp celu: Domowy (PLN)    | Ostatnie odświeżenie: 12:01 |
| [Odśwież] [Pokaż log importu]                           |
-------------------------------------------------
| Status: odświeżanie... / błąd API (spróbuj ponownie)     |
-------------------------------------------------
```
