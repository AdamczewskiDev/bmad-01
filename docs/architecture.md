#!/usr/bin/env markdown
# Architecture — b-home (draft)

## Cel
- Zaprojektować system web + mobile do budżetu domowego z portfelami współdzielonymi, importem transakcji (mBank, Santander) i wielowalutowością (PLN/EUR/USD).

## Wymagania kluczowe (z PRD)
- Portfele współdzielone: właściciel + współużytkownicy (domyślnie mogą edytować swoje; właściciel może rozszerzyć uprawnienia).
- Import 90 dni przy pierwszym podpięciu, przyrostowo potem; PSD2; banki: mBank, Santander.
- Kategorie: zestaw startowy + własne; raporty/wykresy; wiele portfeli/celów.
- FX: kursy NBP, aktualizacja 1x/dzień 12:00.
- Retencja: transakcje do usunięcia przez użytkownika; logi/audit 12 miesięcy.

## Propozycja wysokopoziomowa
- Frontend: web (SPA/SSR) + mobile (React Native + TypeScript), auth + ekran portfeli, transakcje, import-status, raporty.
- Backend API: REST (na start) z dedykowanymi endpointami raportowymi/aggregations; moduły: auth, users, wallets, transactions, categories, reporting, integrations, FX, notifications.
- Integracje bankowe: oddzielny serwis/adaptor PSD2 (async import), kolejki do przetwarzania i kategoryzacji.
- Storage:
  - DB relacyjna (np. Postgres) dla kont, portfeli, transakcji, kategorii, uprawnień, FX rates.
  - Object storage na eksporty/raporty (opcjonalne).
  - Secret store/ KMS na tokeny integracji.
- Asynchroniczne przetwarzanie: kolejki do importu i kategoryzacji; job schedulery dla FX update (12:00) i odświeżenia zgód PSD2.
- Cache raportów: per dzień/portfel (z parametrami daty/użytkownika) dla wykresów i podsumowań.
- Observability: logi/audit 12m; metryki (import SLA, błędy PSD2, czas renderu dashboardu).

## Otwarte decyzje dla implementacji
- Kategoryzacja: prosty mapping + regexy teraz, ewentualnie lekki model ML później.
- Zakres cachingu raportów: obecnie per dzień/portfel; można rozszerzyć o cache per zakres dat dla dużych raportów.

## Następne kroki
- Uszczegółowić diagram koncepcyjny (usługi, przepływ importu, uprawnienia).
- Zaprojektować model danych (users, wallets, memberships, transactions, categories, fx_rates, bank_connections, bank_transactions, audit_logs).
- Opisać przepływy: import bankowy (PSD2), dodanie transakcji ręcznej, współdzielenie portfela, aktualizacja kursów FX.

## Model danych (szkic)
- users (id, email, hashed_password, status, created_at)
- wallets (id, owner_id, name, base_currency, goal_amount?, limit_amount?, created_at)
- wallet_memberships (id, wallet_id, user_id, role, permissions_override?)
- categories (id, user_id?, name, parent_id?, type: income/expense, is_default)
- transactions (id, wallet_id, user_id, type, amount, currency, amount_base, category_id, note, source: manual/bank, bank_tx_id?, created_at, booked_at)
- bank_connections (id, user_id, bank, status, consent_valid_until, refresh_token_encrypted, created_at)
- bank_transactions (id, bank_connection_id, external_id, raw_payload, mapped: bool, mapped_category_id?, booked_at, amount, currency, status)
- fx_rates (id, as_of_date, base=PLN, currency, rate, source=NBP)
- audit_logs (id, actor_id, action, entity_type, entity_id, context, created_at)

## Diagram koncepcyjny (tekstowo)
- Użytkownik ma konta bankowe (bank_connections) i portfele (wallets).
- Portfel ma wielu członków (wallet_memberships) z rolami/uprawnieniami.
- Transakcje należą do portfela, mają kategorie i mogą pochodzić z bank_transactions.
- FX rates dostarcza przeliczniki dla amount_base w walucie portfela.
- Audit_logs śledzą działania (dodanie transakcji, importy, zmiany uprawnień).

## Przepływy (szkic)
- Import PSD2:
  1) Użytkownik łączy bank (mBank/Santander) → consent PSD2.
  2) Scheduler/kolejka pobiera historię 90 dni przy pierwszym podpięciu; potem przyrostowo.
  3) Zapis bank_transactions, mapowanie kategorii (prosty mapping); transakcje do walleta (domyślny lub wskazany).
  4) Status importu i ewentualne błędy w widoku usera; retry/backoff na błędach.
- Dodanie transakcji ręcznej:
  1) Użytkownik wybiera portfel, kwotę, kategorię, walutę; przelicznik do base_currency portfela (NBP rate z dnia).
  2) Zapis do transactions; aktualizacja cache raportów dla portfela/dnia.
- Współdzielenie portfela:
  1) Właściciel zaprasza usera; membership z rolą i opcjonalnym override uprawnień.
  2) Domyślnie współużytkownik edytuje/usuwa swoje transakcje; właściciel może rozszerzyć zakres.
  3) Dostępy egzekwowane w API (permissions per wallet).
- Aktualizacja FX:
  1) Scheduler 12:00 pobiera kursy NBP (PLN jako base).
  2) Zapis do fx_rates; przeliczenia transakcji w raportach używają kursu z daty booked_at (z fallback do najbliższego wcześniejszego).

## Przepływy (sekwencje skrótowo)
- Import PSD2 (async):
  - User → Integrations: consent
  - Scheduler → Bank API: fetch (90 dni / incremental)
  - Integrations → Queue → Import Worker: zapis bank_transactions, mapowanie, utworzenie transactions
  - Worker → Reporting Cache: invalidate/update
  - API → User: status importu, błędy, retry
- Współdzielenie portfela:
  - Owner → API: invite user → wallet_memberships
  - Member → API: actions limited by membership (default: own tx only; owner may extend)
  - API → Audit Logs: zapis zmian uprawnień i operacji
  - Reports respect wallet permissions
