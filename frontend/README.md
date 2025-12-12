# b-home Frontend

Frontend aplikacji do zarządzania budżetem domowym. Zbudowany z Next.js 16, React 19, TypeScript i Tailwind CSS.

## 🚀 Szybki start

### Wymagania

- Node.js 20+
- npm lub yarn
- Backend API uruchomiony na http://localhost:3000

### Instalacja

```bash
# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp .env.example .env
# Edytuj .env jeśli backend działa na innym porcie

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3001**

## 📁 Struktura projektu

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── auth/         # Strony autentykacji (login, register)
│   │   ├── wallets/      # Strony portfeli
│   │   ├── transactions/ # Strony transakcji
│   │   ├── reports/      # Strony raportów
│   │   └── page.tsx      # Strona główna
│   ├── components/       # Komponenty React
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React Contexts
│   │   └── AuthContext.tsx
│   ├── lib/              # Biblioteki i utilities
│   │   └── api.ts        # API client (axios)
│   └── types/            # TypeScript types
│       └── index.ts
└── public/               # Statyczne pliki
```

## 🔑 Funkcjonalności

### Autentykacja
- Rejestracja użytkownika
- Logowanie z JWT token
- Automatyczne przekierowanie dla niezalogowanych
- Protected routes

### Portfele
- Lista portfeli użytkownika
- Tworzenie nowych portfeli
- Szczegóły portfela
- Usuwanie portfeli (tylko właściciel)
- Zapraszanie członków (do zaimplementowania)

### Transakcje
- Lista transakcji z filtrowaniem po portfelu
- Tworzenie transakcji (wielowalutowe)
- Automatyczna konwersja do waluty bazowej portfela
- Usuwanie transakcji
- Filtrowanie po kategoriach

### Raporty
- Podział wydatków według kategorii
- Postęp w osiąganiu celów oszczędnościowych
- Filtrowanie po portfelu i zakresie dat

## 🛠️ Skrypty

```bash
# Rozwój (watch mode)
npm run dev

# Build produkcyjny
npm run build

# Start produkcyjny
npm run start

# Linting
npm run lint
```

## 🔌 Konfiguracja API

API endpoint jest konfigurowany przez zmienną środowiskową:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Domyślnie aplikacja łączy się z backendem na `http://localhost:3000`.

## 📱 Routing

- `/` - Strona główna (dashboard)
- `/auth/login` - Logowanie
- `/auth/register` - Rejestracja
- `/wallets` - Lista portfeli
- `/wallets/:id` - Szczegóły portfela (do zaimplementowania)
- `/transactions` - Lista transakcji
- `/reports` - Raporty

## 🔒 Bezpieczeństwo

- JWT tokens przechowywane w localStorage
- Automatyczne dodawanie tokena do requestów (axios interceptor)
- Automatyczne przekierowanie przy wygaśnięciu tokena
- Protected routes dla wymagających autentykacji

## 🎨 Styling

Aplikacja używa Tailwind CSS dla stylowania. Wszystkie komponenty są responsywne i działają na urządzeniach mobilnych.

## 📝 TODO / Do zaimplementowania

- [ ] Szczegóły portfela z listą transakcji
- [ ] Zapraszanie członków do portfela
- [ ] Edycja transakcji
- [ ] Wykresy wydatków w czasie
- [ ] Eksport raportów
- [ ] Integracja z bankami (PSD2)
- [ ] Notyfikacje
- [ ] Dark mode

## 🐛 Troubleshooting

### Błędy połączenia z API

1. Sprawdź czy backend działa: `curl http://localhost:3000`
2. Sprawdź `NEXT_PUBLIC_API_URL` w `.env`
3. Sprawdź CORS w backendzie

### Błędy autentykacji

1. Sprawdź czy token jest w localStorage
2. Sprawdź czy token nie wygasł
3. Spróbuj wylogować się i zalogować ponownie

### Błędy kompilacji

```bash
# Wyczyść cache i przebuduj
rm -rf .next node_modules
npm install
npm run build
```

---

**Wersja:** 0.1.0  
**Ostatnia aktualizacja:** 2025-12-12
