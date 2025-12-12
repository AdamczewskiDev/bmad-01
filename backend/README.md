# b-home Backend API

Backend API dla aplikacji do zarządzania budżetem domowym. Zbudowany z użyciem NestJS, TypeORM i PostgreSQL.

## 🚀 Szybki start

### Wymagania

- Node.js 20+
- PostgreSQL 16+
- npm lub yarn

### Instalacja

```bash
# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp .env.example .env
# Edytuj .env i ustaw DATABASE_URL

# Uruchom migracje (TypeORM synchronizuje automatycznie w trybie dev)
npm run start:dev
```

### Konfiguracja

Utwórz plik `.env` w katalogu `backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bhome?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
```

## 📚 Dokumentacja API

Po uruchomieniu backendu, dokumentacja Swagger jest dostępna pod adresem:

**http://localhost:3000/api**

### Autentykacja

Większość endpointów wymaga autentykacji JWT. Po zalogowaniu otrzymasz token, który należy przekazać w nagłówku:

```
Authorization: Bearer <your-jwt-token>
```

## 🔑 Endpointy

### Autentykacja (`/auth`)

#### POST `/auth/register`
Rejestracja nowego użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "status": "active",
    "createdAt": "2025-12-12T10:00:00Z"
  },
  "token": "jwt-token"
}
```

#### POST `/auth/login`
Logowanie użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "status": "active"
  },
  "token": "jwt-token"
}
```

### Kategorie (`/categories`)

Wszystkie endpointy wymagają autentykacji.

#### GET `/categories`
Pobiera listę kategorii dostępnych dla użytkownika (domyślne + własne).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Jedzenie",
    "type": "EXPENSE",
    "isDefault": true,
    "createdAt": "2025-12-12T10:00:00Z"
  }
]
```

#### POST `/categories`
Tworzy nową kategorię.

**Request:**
```json
{
  "name": "Moja kategoria",
  "type": "EXPENSE"
}
```

#### PATCH `/categories/:id`
Aktualizuje kategorię (tylko własne, nie domyślne).

#### DELETE `/categories/:id?newCategoryId=uuid`
Usuwa kategorię. Opcjonalnie można przekazać `newCategoryId` aby przenieść transakcje do innej kategorii.

### Portfele (`/wallets`)

Wszystkie endpointy wymagają autentykacji.

#### GET `/wallets`
Pobiera listę portfeli użytkownika (własne + gdzie jest członkiem).

#### GET `/wallets/:id`
Pobiera szczegóły portfela z ostatnimi transakcjami.

#### POST `/wallets`
Tworzy nowy portfel.

**Request:**
```json
{
  "name": "Portfel Domowy",
  "baseCurrency": "PLN",
  "goalAmount": 5000,
  "limitAmount": 3000
}
```

#### PATCH `/wallets/:id`
Aktualizuje portfel (tylko właściciel).

#### DELETE `/wallets/:id`
Usuwa portfel (tylko właściciel).

#### POST `/wallets/:id/invite`
Zaprasza użytkownika do portfela.

**Request:**
```json
{
  "email": "member@example.com",
  "canEditAll": false
}
```

#### PATCH `/wallets/:id/members/:memberId`
Aktualizuje uprawnienia członka.

**Request:**
```json
{
  "canEditAll": true
}
```

#### DELETE `/wallets/:id/members/:memberId`
Usuwa członka z portfela.

### Transakcje (`/transactions`)

Wszystkie endpointy wymagają autentykacji.

#### GET `/transactions?walletId=uuid`
Pobiera listę transakcji. Opcjonalnie filtruje po portfelu.

#### GET `/transactions/:id`
Pobiera szczegóły transakcji.

#### POST `/transactions`
Tworzy nową transakcję. Automatycznie konwertuje kwotę do waluty bazowej portfela.

**Request:**
```json
{
  "type": "EXPENSE",
  "amount": 100.50,
  "currency": "PLN",
  "walletId": "uuid",
  "categoryId": "uuid",
  "note": "Zakupy w sklepie",
  "bookedAt": "2025-12-12T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "type": "EXPENSE",
  "amount": "100.50",
  "currency": "PLN",
  "amountBase": "100.50",
  "note": "Zakupy w sklepie",
  "bookedAt": "2025-12-12T10:00:00Z",
  "wallet": { ... },
  "category": { ... }
}
```

#### PATCH `/transactions/:id`
Aktualizuje transakcję (z uprawnieniami).

#### DELETE `/transactions/:id`
Usuwa transakcję (z uprawnieniami).

### Raporty (`/reports`)

Wszystkie endpointy wymagają autentykacji.

#### GET `/reports/expenses-over-time?walletId=uuid&startDate=2025-12-01&endDate=2025-12-31`
Pobiera wydatki w czasie.

#### GET `/reports/category-breakdown?walletId=uuid&startDate=2025-12-01&endDate=2025-12-31`
Pobiera podział wydatków według kategorii.

**Response:**
```json
[
  {
    "category": "Jedzenie",
    "total": 500,
    "count": 10
  }
]
```

#### GET `/reports/goal-progress?walletId=uuid`
Pobiera postęp w osiąganiu celów oszczędnościowych.

**Response:**
```json
[
  {
    "walletId": "uuid",
    "walletName": "Portfel Domowy",
    "goalAmount": 5000,
    "currentAmount": 2500,
    "progress": 50
  }
]
```

## 🔐 Uprawnienia

### Portfele

- **Właściciel** może:
  - Edytować i usuwać portfel
  - Zapraszać i usuwać członków
  - Edytować wszystkie transakcje

- **Członek** może:
  - Przeglądać portfel i transakcje
  - Edytować tylko swoje transakcje (chyba że ma `canEditAll: true`)

### Transakcje

- Właściciel portfela może edytować wszystkie transakcje
- Członek z `canEditAll: true` może edytować wszystkie transakcje
- Członek z `canEditAll: false` może edytować tylko swoje transakcje

## 💱 Konwersja walut

System automatycznie konwertuje transakcje do waluty bazowej portfela:

- Kursy walut pobierane z API NBP (EUR, USD)
- PLN jest walutą bazową (kurs = 1)
- Konwersja odbywa się przy tworzeniu/aktualizacji transakcji
- Kursy są cache'owane w bazie danych

## 📊 Domyślne kategorie

Przy starcie aplikacji automatycznie tworzone są następujące kategorie:

**Wydatki:**
- Jedzenie
- Transport
- Mieszkanie
- Zdrowie
- Rozrywka
- Oszczędności
- Inwestycje

**Przychody:**
- Wynagrodzenie
- Premia
- Inne przychody

## 🛠️ Skrypty

```bash
# Rozwój (watch mode)
npm run start:dev

# Produkcja
npm run build
npm run start:prod

# Linting
npm run lint

# Testy
npm run test
```

## 🗄️ Baza danych

Backend używa TypeORM z PostgreSQL. W trybie deweloperskim (`synchronize: true`) schemat jest automatycznie synchronizowany z entities.

**Uwaga:** W produkcji użyj migracji zamiast `synchronize: true`!

### Struktura bazy

- `users` - Użytkownicy
- `wallets` - Portfele
- `wallet_memberships` - Członkostwa w portfelach
- `categories` - Kategorie
- `transactions` - Transakcje
- `fx_rates` - Kursy walut
- `bank_connections` - Połączenia bankowe (przyszłość)
- `bank_transactions` - Transakcje bankowe (przyszłość)
- `audit_logs` - Logi audytowe (przyszłość)

## 🔒 Bezpieczeństwo

- Hasła są hashowane używając bcrypt (10 rounds)
- JWT tokens z 7-dniowym czasem ważności
- Walidacja danych wejściowych (class-validator)
- CORS włączony (skonfiguruj dla produkcji)

## 📝 Przykłady użycia

### Pełny flow: Rejestracja → Portfel → Transakcja

```bash
# 1. Rejestracja
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 2. Logowanie (zapisz token)
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 3. Utworzenie portfela
WALLET_ID=$(curl -s -X POST http://localhost:3000/wallets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Portfel Domowy","baseCurrency":"PLN"}' \
  | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# 4. Pobranie kategorii
CATEGORY_ID=$(curl -s http://localhost:3000/categories \
  -H "Authorization: Bearer $TOKEN" \
  | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# 5. Utworzenie transakcji
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"EXPENSE\",\"amount\":100,\"currency\":\"PLN\",\"walletId\":\"$WALLET_ID\",\"categoryId\":\"$CATEGORY_ID\"}"
```

## 🐛 Troubleshooting

### Backend nie startuje

1. Sprawdź czy PostgreSQL działa: `pg_isready`
2. Sprawdź `DATABASE_URL` w `.env`
3. Sprawdź logi: `tail -f /tmp/backend.log`

### Błędy połączenia z bazą

```bash
# Sprawdź połączenie
psql $DATABASE_URL

# Utwórz bazę jeśli nie istnieje
createdb bhome
```

### Błędy kompilacji TypeScript

```bash
# Wyczyść i przebuduj
rm -rf dist node_modules
npm install
npm run build
```

## 📞 Wsparcie

W razie problemów sprawdź:
1. Dokumentację Swagger: http://localhost:3000/api
2. Logi aplikacji
3. Status bazy danych

---

**Wersja:** 1.0.0  
**Ostatnia aktualizacja:** 2025-12-12
