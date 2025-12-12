# 🚂 Szczegółowy Przewodnik Konfiguracji Railway

## 📋 Krok 1: Przygotowanie Projektu

### 1.1 Sprawdź czy projekt jest na GitHub

```bash
# Sprawdź czy masz remote
git remote -v

# Jeśli nie masz, dodaj:
git remote add origin https://github.com/TWOJA_NAZWA/b-home.git
git push -u origin main
```

### 1.2 Upewnij się, że build działa lokalnie

```bash
# Backend
cd backend
npm install
npm run build
# Powinno zbudować bez błędów

# Frontend  
cd ../frontend
npm install
npm run build
# Powinno zbudować bez błędów
```

---

## 🎯 Krok 2: Rejestracja na Railway

1. **Przejdź na** [railway.app](https://railway.app)
2. **Kliknij "Start a New Project"** lub **"Login"**
3. **Zaloguj się przez GitHub** (najłatwiej - kliknij "Login with GitHub")
4. **Autoryzuj Railway** - pozwól na dostęp do repozytoriów GitHub

---

## 🗄️ Krok 3: Utworzenie Projektu i Bazy Danych

### 3.1 Utwórz Nowy Projekt

1. Po zalogowaniu zobaczysz dashboard Railway
2. **Kliknij "New Project"** (duży przycisk)
3. **Wybierz "Deploy from GitHub repo"**
4. **Wybierz repozytorium** `b-home` z listy
5. Railway automatycznie utworzy projekt i zacznie deploy (na razie możemy to anulować)

### 3.2 Dodaj PostgreSQL Database

1. W projekcie Railway zobaczysz pusty dashboard
2. **Kliknij przycisk "+ New"** (w prawym górnym rogu lub na środku)
3. **Wybierz "Database"** z menu
4. **Kliknij "Add PostgreSQL"**
5. Railway automatycznie:
   - Utworzy bazę PostgreSQL
   - Wygeneruje zmienną `DATABASE_URL`
   - Baza będzie widoczna jako osobny serwis w projekcie

**✅ Sprawdź:**
- W liście serwisów powinieneś zobaczyć "Postgres" z zielonym statusem
- Kliknij na Postgres → Settings → Variables
- Powinieneś zobaczyć `DATABASE_URL` (to jest zmienna, którą użyjemy w backendzie)

---

## 🔧 Krok 4: Konfiguracja Backend Service

### 4.1 Dodaj Backend Service

1. **Kliknij "+ New"** ponownie
2. **Wybierz "GitHub Repo"**
3. **Wybierz to samo repozytorium** `b-home`
4. Railway automatycznie wykryje projekt i zacznie deploy

### 4.2 Skonfiguruj Backend Service

1. **Kliknij na nowo utworzony serwis** (prawdopodobnie nazywa się tak jak repozytorium)
2. **Kliknij "Settings"** (w górnym menu)
3. **Znajdź sekcję "Service"** i ustaw:

   **Name:**
   ```
   backend
   ```

   **Root Directory:**
   ```
   backend
   ```
   > To mówi Railway, że kod backendu jest w folderze `backend/`

   **Build Command:**
   ```
   npm install && npm run build
   ```

   **Start Command:**
   ```
   npm run start:prod
   ```

   **Watch Paths:**
   ```
   backend/**
   ```
   > (opcjonalnie - mówi Railway które pliki obserwować)

### 4.3 Ustaw Zmienne Środowiskowe dla Backend

1. W **Settings** → **Variables** (lub kliknij "Variables" w menu)
2. **Kliknij "+ New Variable"** dla każdej zmiennej:

   **Zmienna 1:**
   - **Name:** `DATABASE_URL`
   - **Value:** `${{Postgres.DATABASE_URL}}`
   > ⚠️ WAŻNE: Użyj dokładnie tej składni z podwójnymi nawiasami klamrowymi!
   > Railway automatycznie podstawi URL do bazy danych

   **Zmienna 2:**
   - **Name:** `JWT_SECRET`
   - **Value:** (wygeneruj bezpieczny sekret - zobacz poniżej)

   **Zmienna 3:**
   - **Name:** `NODE_ENV`
   - **Value:** `production`

   **Zmienna 4:**
   - **Name:** `PORT`
   - **Value:** `3000`

   **Zmienna 5:**
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://twoj-frontend.railway.app`
   > ⚠️ UWAGA: To ustawisz później, po utworzeniu frontendu. Na razie możesz zostawić placeholder.

#### Jak wygenerować JWT_SECRET:

```bash
# W terminalu uruchom:
openssl rand -base64 32
```

Lub użyj tego (32 znaki minimum):
```
super-secret-jwt-key-change-this-in-production-2024
```

### 4.4 Sprawdź Deploy Backend

1. **Kliknij "Deployments"** w menu
2. Zobaczysz proces build i deploy
3. **Kliknij na deployment** aby zobaczyć logi
4. Jeśli build się powiedzie, zobaczysz zielony status ✅

**🔍 Sprawdź logi:**
- Powinieneś zobaczyć: "Backend running on port 3000"
- Jeśli są błędy, sprawdź:
  - Czy `DATABASE_URL` jest poprawnie ustawione
  - Czy build się powiódł
  - Czy wszystkie zmienne są ustawione

---

## 🎨 Krok 5: Konfiguracja Frontend Service

### 5.1 Dodaj Frontend Service

1. **Kliknij "+ New"** ponownie
2. **Wybierz "GitHub Repo"**
3. **Wybierz to samo repozytorium** `b-home`
4. Railway automatycznie wykryje projekt

### 5.2 Skonfiguruj Frontend Service

1. **Kliknij na nowo utworzony serwis**
2. **Kliknij "Settings"**
3. **Znajdź sekcję "Service"** i ustaw:

   **Name:**
   ```
   frontend
   ```

   **Root Directory:**
   ```
   frontend
   ```

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

### 5.3 Ustaw Zmienne Środowiskowe dla Frontend

1. W **Settings** → **Variables**
2. **Kliknij "+ New Variable"**:

   **Zmienna 1:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://twoj-backend.railway.app`
   > ⚠️ WAŻNE: Zamień `twoj-backend.railway.app` na rzeczywisty URL backendu!
   > 
   > Jak znaleźć URL backendu:
   > 1. Kliknij na serwis "backend"
   > 2. Kliknij "Settings" → "Networking"
   > 3. Skopiuj "Public Domain" (np. `backend-production-xxxx.up.railway.app`)
   > 4. Użyj tego URL w `NEXT_PUBLIC_API_URL`

   **Zmienna 2:**
   - **Name:** `NODE_ENV`
   - **Value:** `production`

### 5.4 Sprawdź Deploy Frontend

1. **Kliknij "Deployments"**
2. Zobaczysz proces build i deploy
3. Jeśli build się powiedzie, frontend będzie dostępny pod publicznym URL

---

## 🔗 Krok 6: Połącz Backend z Frontend

### 6.1 Zaktualizuj FRONTEND_URL w Backend

1. **Kliknij na serwis "backend"**
2. **Settings** → **Variables**
3. **Znajdź zmienną `FRONTEND_URL`**
4. **Kliknij na nią i edytuj**
5. **Wklej URL frontendu** (znajdziesz w Settings → Networking serwisu frontend)
6. **Zapisz**

### 6.2 Zrestartuj Backend

1. W serwisie backend → **Settings**
2. **Kliknij "Restart"** (lub użyj przycisku restart w górnym menu)
3. Backend zrestartuje się z nową konfiguracją CORS

---

## ✅ Krok 7: Weryfikacja

### 7.1 Sprawdź czy wszystko działa

1. **Otwórz URL frontendu** (Settings → Networking → Public Domain)
2. **Powinieneś zobaczyć aplikację**
3. **Spróbuj zarejestrować użytkownika**
4. **Sprawdź czy backend odpowiada:**
   - Otwórz `https://twoj-backend.railway.app/api` (Swagger docs)

### 7.2 Sprawdź logi

1. **Backend** → **Deployments** → wybierz ostatni deployment → **View Logs**
2. **Frontend** → **Deployments** → wybierz ostatni deployment → **View Logs**
3. Szukaj błędów (czerwone linie)

---

## 🐛 Rozwiązywanie Problemów

### Problem: Backend nie startuje

**Sprawdź:**
1. ✅ Czy `DATABASE_URL` jest ustawione (powinno być `${{Postgres.DATABASE_URL}}`)
2. ✅ Czy `JWT_SECRET` jest ustawione (min 32 znaki)
3. ✅ Czy `PORT` jest ustawione na `3000`
4. ✅ Sprawdź logi - mogą pokazać dokładny błąd

**Częste błędy:**
- `Cannot connect to database` → Sprawdź `DATABASE_URL`
- `Port already in use` → Sprawdź czy `PORT` jest ustawione
- `JWT_SECRET is missing` → Dodaj zmienną `JWT_SECRET`

### Problem: Frontend nie łączy się z backendem

**Sprawdź:**
1. ✅ Czy `NEXT_PUBLIC_API_URL` jest ustawione na poprawny URL backendu
2. ✅ Czy backend działa (otwórz URL backendu w przeglądarce)
3. ✅ Czy `FRONTEND_URL` w backendzie jest ustawione na URL frontendu
4. ✅ Sprawdź konsolę przeglądarki (F12) - mogą być błędy CORS

**Częste błędy:**
- `CORS error` → Sprawdź `FRONTEND_URL` w backendzie
- `Network error` → Sprawdź `NEXT_PUBLIC_API_URL`
- `404 Not Found` → Sprawdź czy backend działa

### Problem: Build się nie powodzi

**Sprawdź:**
1. ✅ Czy build działa lokalnie (`npm run build`)
2. ✅ Czy wszystkie zależności są w `package.json`
3. ✅ Sprawdź logi build - mogą pokazać dokładny błąd

**Częste błędy:**
- `Module not found` → Sprawdź czy wszystkie zależności są zainstalowane
- `TypeScript errors` → Napraw błędy TypeScript lokalnie
- `Out of memory` → Railway może mieć za mało pamięci (sprawdź plan)

### Problem: Baza danych nie działa

**Sprawdź:**
1. ✅ Czy serwis Postgres jest uruchomiony (zielony status)
2. ✅ Czy `DATABASE_URL` jest poprawnie ustawione w backendzie
3. ✅ Sprawdź logi backendu - mogą pokazać błędy połączenia

---

## 📊 Przydatne Informacje

### Jak znaleźć URL-e serwisów:

1. **Kliknij na serwis** (backend/frontend)
2. **Settings** → **Networking**
3. **Public Domain** - to jest publiczny URL
4. Możesz też kliknąć "Generate Domain" aby utworzyć własną domenę

### Jak zobaczyć logi:

1. **Kliknij na serwis**
2. **Deployments** → wybierz deployment → **View Logs**
3. Lub kliknij **"Logs"** w menu (pokazuje live logi)

### Jak zrestartować serwis:

1. **Kliknij na serwis**
2. **Settings** → **Restart**
3. Lub użyj przycisku restart w górnym menu

### Jak dodać więcej zmiennych:

1. **Settings** → **Variables**
2. **"+ New Variable"**
3. Wpisz Name i Value
4. **Save**

---

## 🎉 Gratulacje!

Jeśli wszystko działa, masz:
- ✅ Backend działający na Railway
- ✅ Frontend działający na Railway  
- ✅ PostgreSQL bazę danych
- ✅ Automatyczny deploy z GitHub (każdy push = nowy deploy)

---

## 📝 Następne Kroki

1. **Przetestuj aplikację** - zarejestruj użytkownika, utwórz portfel
2. **Monitoruj logi** przez pierwsze dni
3. **Sprawdź koszty** w Settings → Usage (darmowy tier to $5/miesiąc)
4. **Opcjonalnie:** Skonfiguruj własną domenę w Settings → Networking

---

**Potrzebujesz pomocy?** Sprawdź:
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

