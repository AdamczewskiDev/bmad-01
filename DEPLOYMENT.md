# 🚀 Przewodnik Deploy - b-home

## 📋 Przygotowanie do Deploy

### 1. Sprawdź czy projekt jest gotowy

```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd frontend
npm install
npm run build
```

### 2. Przygotuj repozytorium GitHub

```bash
# Jeśli jeszcze nie masz repozytorium
git init
git add .
git commit -m "Initial commit: b-home app ready for deployment"

# Utwórz repozytorium na GitHub, potem:
git remote add origin https://github.com/TWOJA_NAZWA/b-home.git
git branch -M main
git push -u origin main
```

---

## 🎯 Opcja 1: Railway (Wszystko w jednym) ⭐ REKOMENDACJA

### Krok 1: Rejestracja i Setup

1. Przejdź na [railway.app](https://railway.app)
2. Zarejestruj się (możesz użyć konta GitHub)
3. Kliknij "New Project"
4. Wybierz "Deploy from GitHub repo"
5. Wybierz swoje repozytorium `b-home`

### Krok 2: Dodaj PostgreSQL Database

1. W projekcie Railway kliknij "+ New"
2. Wybierz "Database" → "Add PostgreSQL"
3. Railway automatycznie utworzy bazę i zmienną `DATABASE_URL`

### Krok 3: Dodaj Backend Service

1. Kliknij "+ New" → "GitHub Repo"
2. Wybierz to samo repozytorium
3. W ustawieniach serwisu:
   - **Name**: `backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Port**: `3000` (lub zostaw puste - Railway wykryje automatycznie)

4. **Zmienne środowiskowe** (Settings → Variables):
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=twoj-super-tajny-sekret-min-32-znaki-zmien-to
   FRONTEND_URL=https://twoj-frontend.railway.app
   NODE_ENV=production
   PORT=3000
   ```
   > **Uwaga**: `FRONTEND_URL` ustawisz po utworzeniu frontendu

### Krok 4: Dodaj Frontend Service

1. Kliknij "+ New" → "GitHub Repo"
2. Wybierz to samo repozytorium
3. W ustawieniach serwisu:
   - **Name**: `frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Port**: (zostaw puste - Next.js automatycznie)

4. **Zmienne środowiskowe**:
   ```
   NEXT_PUBLIC_API_URL=https://twoj-backend.railway.app
   NODE_ENV=production
   ```
   > **Uwaga**: Zamień `twoj-backend.railway.app` na rzeczywisty URL backendu (znajdziesz w Settings → Networking)

### Krok 5: Aktualizuj FRONTEND_URL w Backend

1. W serwisie Backend → Settings → Variables
2. Zaktualizuj `FRONTEND_URL` na URL frontendu
3. Zrestartuj backend (Settings → Restart)

### Krok 6: Sprawdź Deploy

1. Railway automatycznie zbuduje i wdroży aplikację
2. Sprawdź logi w zakładce "Deployments"
3. Kliknij "Settings" → "Networking" aby zobaczyć URL-e

---

## 🎯 Opcja 2: Vercel (Frontend) + Railway (Backend)

### Część 1: Railway - Backend + Database

Wykonaj kroki 1-3 z Opcji 1 (PostgreSQL + Backend)

### Część 2: Vercel - Frontend

1. Przejdź na [vercel.com](https://vercel.com)
2. Zarejestruj się (możesz użyć konta GitHub)
3. Kliknij "Add New" → "Project"
4. Importuj repozytorium `b-home`
5. **Konfiguracja projektu**:
   - **Framework Preset**: Next.js (automatycznie wykryty)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (automatyczny)
   - **Output Directory**: `.next` (automatyczny)
   - **Install Command**: `npm install` (automatyczny)

6. **Zmienne środowiskowe** (Settings → Environment Variables):
   ```
   NEXT_PUBLIC_API_URL=https://twoj-backend.railway.app
   ```
   > Zamień na rzeczywisty URL backendu z Railway

7. Kliknij "Deploy"
8. Vercel automatycznie zbuduje i wdroży frontend

---

## 🔧 Rozwiązywanie Problemów

### Backend nie startuje

1. Sprawdź logi w Railway
2. Sprawdź czy `DATABASE_URL` jest ustawione
3. Sprawdź czy `JWT_SECRET` jest ustawione (min 32 znaki)
4. Sprawdź czy port jest poprawny

### Frontend nie łączy się z backendem

1. Sprawdź `NEXT_PUBLIC_API_URL` w Vercel
2. Sprawdź CORS w backendzie - `FRONTEND_URL` musi być ustawione
3. Sprawdź czy backend działa (otwórz URL w przeglądarce)

### Baza danych nie działa

1. Sprawdź czy PostgreSQL service jest uruchomiony w Railway
2. Sprawdź `DATABASE_URL` w zmiennych środowiskowych
3. Sprawdź logi backendu - mogą pokazać błędy połączenia

### Błędy build

1. Sprawdź logi build w Railway/Vercel
2. Upewnij się, że wszystkie zależności są w `package.json`
3. Sprawdź czy Node.js version jest kompatybilna (20+)

---

## 📊 Monitoring i Logi

### Railway
- Logi: Każdy serwis ma zakładkę "Logs"
- Metrics: Settings → Metrics (CPU, Memory, Network)

### Vercel
- Logi: Project → Deployments → wybierz deployment → Logs
- Analytics: Project → Analytics (wymaga upgrade dla szczegółów)

---

## 🔐 Bezpieczeństwo

### Ważne zmienne do zmiany w produkcji:

1. **JWT_SECRET**: Użyj długiego, losowego stringa (min 32 znaki)
   ```bash
   # Wygeneruj bezpieczny sekret:
   openssl rand -base64 32
   ```

2. **DATABASE_URL**: Railway generuje bezpieczny URL automatycznie

3. **FRONTEND_URL**: Ustaw na rzeczywisty URL frontendu

---

## 💰 Koszty

### Railway
- Darmowy tier: $5 kredytów miesięcznie
- Wystarczy dla małej aplikacji
- Po wyczerpaniu: ~$5-10/miesiąc

### Vercel
- Darmowy tier: bardzo hojny
- 100GB bandwidth/miesiąc
- Unlimited requests
- Wystarczy dla większości aplikacji

---

## 🎉 Po Deploy

1. Przetestuj aplikację:
   - Otwórz URL frontendu
   - Zarejestruj użytkownika
   - Utwórz portfel
   - Dodaj transakcję

2. Sprawdź Swagger API:
   - Otwórz `https://twoj-backend.railway.app/api`

3. Monitoruj logi przez pierwsze dni

---

## 📞 Wsparcie

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway
- Vercel Community: https://github.com/vercel/vercel/discussions

---

**Powodzenia z deployem! 🚀**

