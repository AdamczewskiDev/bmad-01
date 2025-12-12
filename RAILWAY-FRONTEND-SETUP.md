# 🎨 Konfiguracja Frontendu na Railway

## Krok 1: Dodaj Frontend Service na Railway

### 1.1 Utwórz nowy serwis

1. **W Railway Dashboard** (w tym samym projekcie gdzie masz backend)
2. **Kliknij "+ New"** (w prawym górnym rogu)
3. **Wybierz "GitHub Repo"**
4. **Wybierz to samo repozytorium** `b-home`
5. Railway automatycznie wykryje projekt i zacznie deploy

### 1.2 Skonfiguruj Frontend Service

1. **Kliknij na nowo utworzony serwis** (prawdopodobnie nazywa się tak jak repozytorium)
2. **Kliknij "Settings"** (w górnym menu)
3. **Znajdź sekcję "Service"** i ustaw:

   **Name:**
   ```
   frontend
   ```

   **Root Directory:**
   ```
   frontend
   ```
   > To mówi Railway, że kod frontendu jest w folderze `frontend/`

   **Build Command:**
   ```
   npm install && npm run build
   ```

   **Start Command:**
   ```
   npm run start
   ```

   **Watch Paths:**
   ```
   frontend/**
   ```
   > (opcjonalnie)

### 1.3 Sprawdź czy build działa

1. **Kliknij "Deployments"** w menu
2. Zobaczysz proces build i deploy
3. **Kliknij na deployment** aby zobaczyć logi
4. Jeśli build się powiedzie, zobaczysz zielony status ✅

**🔍 Sprawdź logi:**
- Powinieneś zobaczyć: "Ready on http://localhost:XXXX"
- Jeśli są błędy, sprawdź czy wszystkie zależności są zainstalowane

---

## Krok 2: Skonfiguruj Zmienne Środowiskowe

### 2.1 Znajdź URL Backendu

1. **Kliknij na serwis "backend"** w Railway
2. **Settings → Networking**
3. **Skopiuj "Public Domain"** (np. `backend-production-xxxx.up.railway.app`)
4. **Zapisz ten URL** - będziesz go potrzebować

### 2.2 Ustaw zmienne w Frontend Service

1. **W serwisie Frontend** → **Settings → Variables**
2. **Kliknij "+ New Variable"** dla każdej zmiennej:

   **Zmienna 1:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://twoj-backend-url.railway.app`
   > ⚠️ WAŻNE: Zamień `twoj-backend-url.railway.app` na rzeczywisty URL backendu (skopiowany w kroku 2.1)
   > 
   > Przykład: `https://backend-production-abc123.up.railway.app`

   **Zmienna 2:**
   - **Name:** `NODE_ENV`
   - **Value:** `production`

### 2.3 Zaktualizuj FRONTEND_URL w Backend

1. **Kliknij na serwis "backend"** w Railway
2. **Settings → Networking**
3. **Skopiuj "Public Domain"** frontendu (znajdziesz w serwisie frontend → Settings → Networking)
4. **Settings → Variables**
5. **Znajdź zmienną `FRONTEND_URL`** (lub dodaj jeśli nie ma)
6. **Ustaw wartość** na URL frontendu (np. `https://frontend-production-xxxx.up.railway.app`)
7. **Zapisz**

### 2.4 Zrestartuj Backend

1. **W serwisie Backend** → **Settings**
2. **Kliknij "Restart"** (lub użyj przycisku restart w górnym menu)
3. Backend zrestartuje się z nową konfiguracją CORS

---

## Krok 3: Sprawdź czy wszystko działa

### 3.1 Sprawdź URL-e

1. **Backend Service** → **Settings → Networking** → **Public Domain**
2. **Frontend Service** → **Settings → Networking** → **Public Domain**

### 3.2 Przetestuj Backend

1. **Otwórz URL backendu** w przeglądarce
2. **Powinieneś zobaczyć** odpowiedź API lub błąd 404 (to normalne)
3. **Sprawdź Swagger:** `https://twoj-backend-url.railway.app/api`
   - Powinieneś zobaczyć dokumentację Swagger ✅

### 3.3 Przetestuj Frontend

1. **Otwórz URL frontendu** w przeglądarce
2. **Powinieneś zobaczyć** stronę logowania lub główną stronę aplikacji ✅

### 3.4 Przetestuj pełny flow

1. **Zarejestruj nowego użytkownika:**
   - Otwórz frontend
   - Kliknij "Register" lub przejdź do `/auth/register`
   - Wypełnij formularz (email, hasło)
   - Kliknij "Register"

2. **Zaloguj się:**
   - Użyj danych z rejestracji
   - Kliknij "Login"

3. **Utwórz portfel:**
   - Po zalogowaniu powinieneś zobaczyć dashboard
   - Kliknij "Utwórz portfel" lub podobny przycisk
   - Wypełnij formularz (nazwa, waluta bazowa)
   - Zapisz

4. **Dodaj transakcję:**
   - Przejdź do sekcji transakcji
   - Kliknij "Dodaj transakcję"
   - Wypełnij formularz (kwota, kategoria, portfel)
   - Zapisz

5. **Sprawdź raporty:**
   - Przejdź do sekcji raportów
   - Sprawdź czy dane się wyświetlają

---

## 🔧 Rozwiązywanie Problemów

### Frontend nie łączy się z backendem

**Sprawdź:**
1. ✅ Czy `NEXT_PUBLIC_API_URL` jest ustawione na poprawny URL backendu
2. ✅ Czy backend działa (otwórz URL backendu w przeglądarce)
3. ✅ Czy `FRONTEND_URL` w backendzie jest ustawione na URL frontendu
4. ✅ Sprawdź konsolę przeglądarki (F12) - mogą być błędy CORS

**Częste błędy:**
- `CORS error` → Sprawdź `FRONTEND_URL` w backendzie
- `Network error` → Sprawdź `NEXT_PUBLIC_API_URL`
- `404 Not Found` → Sprawdź czy backend działa

### Frontend nie buduje się

**Sprawdź:**
1. ✅ Czy build działa lokalnie (`cd frontend && npm run build`)
2. ✅ Sprawdź logi build w Railway
3. ✅ Czy wszystkie zależności są w `package.json`

### Backend nie odpowiada

**Sprawdź:**
1. ✅ Czy backend jest uruchomiony (zielony status w Railway)
2. ✅ Sprawdź logi backendu w Railway
3. ✅ Sprawdź czy `DATABASE_URL` jest ustawione
4. ✅ Sprawdź czy `JWT_SECRET` jest ustawione

---

## ✅ Checklist

- [ ] Frontend Service utworzony na Railway
- [ ] Root Directory ustawione na `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start`
- [ ] `NEXT_PUBLIC_API_URL` ustawione na URL backendu
- [ ] `NODE_ENV=production` ustawione
- [ ] `FRONTEND_URL` w backendzie ustawione na URL frontendu
- [ ] Backend zrestartowany
- [ ] Frontend działa (otwiera się w przeglądarce)
- [ ] Backend działa (Swagger dostępny)
- [ ] Rejestracja działa
- [ ] Logowanie działa
- [ ] Portfele działają
- [ ] Transakcje działają
- [ ] Raporty działają

---

**Powodzenia! 🚀**

