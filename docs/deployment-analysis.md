# Analiza Hostingu i Deploy - b-home

## 📊 Analiza Projektu

### Wymagania techniczne:
- **Backend**: NestJS (Node.js 20+)
- **Frontend**: Next.js 16 (React 19)
- **Baza danych**: PostgreSQL 16+
- **Porty**: Backend (3000), Frontend (3001 lokalnie, w produkcji automatyczny)

### Zmienne środowiskowe:
- `DATABASE_URL` - połączenie z PostgreSQL
- `JWT_SECRET` - sekret do JWT tokens
- `FRONTEND_URL` - URL frontendu (dla CORS)

---

## 🆓 Opcje Darmowego Hostingu

### 1. **Railway** ⭐ REKOMENDACJA

**Dlaczego Railway:**
- ✅ Darmowy tier: $5 kredytów miesięcznie (wystarczy na małą aplikację)
- ✅ Wbudowana baza PostgreSQL (darmowa do 5GB)
- ✅ Automatyczny deploy z GitHub
- ✅ Łatwa konfiguracja zmiennych środowiskowych
- ✅ Wsparcie dla Node.js i Next.js
- ✅ Automatyczne HTTPS
- ✅ Łatwe skalowanie

**Limity darmowe:**
- $5 kredytów miesięcznie
- 512MB RAM per service
- 1GB storage dla bazy danych
- Wystarczy dla małej aplikacji

**Koszt po wyczerpaniu darmowego tieru:**
- ~$5-10/miesiąc dla małej aplikacji

**Jak to działa:**
1. Backend + Frontend jako osobne serwisy
2. PostgreSQL jako osobna baza danych
3. Wszystko w jednym miejscu

---

### 2. **Render**

**Zalety:**
- ✅ Darmowy tier dostępny
- ✅ PostgreSQL wbudowany
- ✅ Automatyczny deploy z GitHub
- ✅ HTTPS automatycznie

**Wady:**
- ⚠️ Darmowy tier może "zasypiać" po 15 min nieaktywności
- ⚠️ Wolniejszy start po uśpieniu
- ⚠️ Ograniczenia na darmowym tierze

**Limity darmowe:**
- 750h/miesiąc (wystarczy)
- PostgreSQL 90 dni (potem trzeba płacić ~$7/miesiąc)
- Web service może zasypiać

---

### 3. **Vercel (Frontend) + Railway/Render (Backend)**

**Zalety:**
- ✅ Vercel to najlepszy hosting dla Next.js (twórcy Next.js)
- ✅ Darmowy tier bardzo hojny
- ✅ Automatyczny deploy z GitHub
- ✅ Edge functions
- ✅ CDN globalny

**Wady:**
- ⚠️ Tylko frontend (backend osobno)
- ⚠️ Więcej konfiguracji (2 platformy)

**Limity darmowe Vercel:**
- 100GB bandwidth/miesiąc
- Unlimited requests
- Automatyczne HTTPS

---

### 4. **Fly.io**

**Zalety:**
- ✅ Darmowy tier
- ✅ Globalna dystrybucja
- ✅ PostgreSQL dostępny

**Wady:**
- ⚠️ Bardziej skomplikowana konfiguracja
- ⚠️ Wymaga więcej wiedzy technicznej

---

### 5. **Neon (PostgreSQL) + Vercel (Frontend) + Railway (Backend)**

**Zalety:**
- ✅ Neon: najlepszy darmowy PostgreSQL (3GB darmowo)
- ✅ Vercel: najlepszy dla Next.js
- ✅ Railway: łatwy deploy backendu

**Wady:**
- ⚠️ Trzy platformy do zarządzania
- ⚠️ Więcej konfiguracji

---

## 🎯 REKOMENDACJA FINALNA

### Opcja A: **Railway (Wszystko w jednym)** ⭐ NAJŁATWIEJSZA

**Dlaczego:**
- Wszystko w jednym miejscu (backend, frontend, baza)
- Najprostsza konfiguracja
- Automatyczny deploy z GitHub
- Wystarczy dla małej aplikacji

**Struktura:**
```
Railway:
├── Backend Service (NestJS)
├── Frontend Service (Next.js)
└── PostgreSQL Database
```

**Koszt:** $0-5/miesiąc (zależnie od użycia)

---

### Opcja B: **Vercel (Frontend) + Railway (Backend + DB)** ⭐ NAJLEPSZA WYDAJNOŚĆ

**Dlaczego:**
- Vercel to najlepszy hosting dla Next.js
- Railway dla backendu i bazy
- Najlepsza wydajność frontendu (CDN globalny)

**Struktura:**
```
Vercel:
└── Frontend (Next.js)

Railway:
├── Backend (NestJS)
└── PostgreSQL Database
```

**Koszt:** $0-5/miesiąc

---

## 📋 Plan Deploy - Railway (Opcja A)

### Krok 1: Przygotowanie do GitHub

1. **Sprawdź .gitignore**
   - Upewnij się, że `.env` jest w .gitignore
   - Sprawdź, że `node_modules` jest ignorowany

2. **Utwórz repozytorium na GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TWOJA_NAZWA/b-home.git
   git push -u origin main
   ```

### Krok 2: Konfiguracja Railway

1. **Zarejestruj się na Railway** (railway.app)
2. **Połącz z GitHub**
3. **Utwórz nowy projekt**
4. **Dodaj PostgreSQL Database**
   - Railway automatycznie utworzy zmienną `DATABASE_URL`
5. **Dodaj Backend Service**
   - Wybierz repozytorium GitHub
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Port: `3000`
6. **Dodaj Frontend Service**
   - Wybierz to samo repozytorium
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Port: automatyczny (Next.js)

### Krok 3: Zmienne środowiskowe

**Backend Service:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=twoj-super-tajny-sekret-min-32-znaki
FRONTEND_URL=https://twoj-frontend.railway.app
NODE_ENV=production
PORT=3000
```

**Frontend Service:**
```env
NEXT_PUBLIC_API_URL=https://twoj-backend.railway.app
NODE_ENV=production
```

### Krok 4: Aktualizacja kodu

**Backend - main.ts:**
- Port powinien być z `process.env.PORT` (Railway ustawia automatycznie)

**Frontend - api.ts:**
- Użyj `NEXT_PUBLIC_API_URL` zamiast hardcoded URL

---

## 📋 Plan Deploy - Vercel + Railway (Opcja B)

### Krok 1: Railway (Backend + DB)

1. Utwórz projekt na Railway
2. Dodaj PostgreSQL Database
3. Dodaj Backend Service (jak wyżej)

### Krok 2: Vercel (Frontend)

1. Zarejestruj się na Vercel (vercel.com)
2. Połącz z GitHub
3. Importuj projekt
4. Root Directory: `frontend`
5. Framework Preset: Next.js
6. Build Command: `npm run build` (automatyczny)
7. Output Directory: `.next` (automatyczny)

**Zmienne środowiskowe Vercel:**
```env
NEXT_PUBLIC_API_URL=https://twoj-backend.railway.app
```

---

## 🔧 Wymagane Zmiany w Kodzie

### Backend - main.ts
```typescript
const port = process.env.PORT || 3000;
await app.listen(port);
```

### Frontend - api.ts
Sprawdź czy używa `process.env.NEXT_PUBLIC_API_URL`

---

## 📊 Porównanie Opcji

| Cecha | Railway (Wszystko) | Vercel + Railway |
|-------|-------------------|-----------------|
| Łatwość setupu | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Wydajność frontendu | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Koszt | $0-5/mies | $0-5/mies |
| Zarządzanie | 1 platforma | 2 platformy |
| Automatyczny deploy | ✅ | ✅ |
| HTTPS | ✅ | ✅ |

---

## 🚀 Następne Kroki

1. Wybierz opcję (Rekomendacja: Railway wszystko w jednym)
2. Przygotuj projekt do GitHub
3. Skonfiguruj hosting
4. Przetestuj deploy
5. Skonfiguruj domenę (opcjonalnie)

---

**Data analizy:** 2025-12-12  
**Wersja:** 1.0

