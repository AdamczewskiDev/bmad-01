# ⚡ Szybka Naprawa - Railway "npm: command not found"

## Problem
Railway generuje Dockerfile bez Node.js, co powoduje błąd `npm: command not found`.

## ✅ Rozwiązanie (2 minuty)

### Krok 1: Wypchnij zmiany

```bash
git add backend/Dockerfile backend/railway.json
git commit -m "Fix Railway deployment - add Dockerfile with Node.js"
git push
```

### Krok 2: W Railway

1. **Otwórz Backend Service**
2. **Settings → Service**
3. **Sprawdź:**
   - **Root Directory**: `backend` ✅
   - **Builder**: Jeśli jest opcja, wybierz "Dockerfile"
4. **Settings → Variables** - upewnij się że masz:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET=...` (min 32 znaki)
   - `NODE_ENV=production`
   - `PORT=3000`
   - `FRONTEND_URL=...` (ustawisz później)

### Krok 3: Zrestartuj Deploy

1. **Deployments** → kliknij **"Redeploy"** na ostatnim deployment
2. **Sprawdź logi** - powinno działać! ✅

## 🎯 Co zostało naprawione:

1. ✅ **backend/Dockerfile** - poprawny Dockerfile z Node.js 20
2. ✅ **backend/railway.json** - konfiguracja wymuszająca użycie Dockerfile
3. ✅ **backend/package.json** - dodane `engines` z wersją Node.js

## 🔍 Jeśli nadal nie działa:

1. **Sprawdź logi** w Railway → Deployments → View Logs
2. **Sprawdź czy Root Directory = `backend`** w Settings
3. **Sprawdź czy Dockerfile jest w repozytorium:**
   ```bash
   git ls-files | grep Dockerfile
   # Powinno pokazać: backend/Dockerfile
   ```

## 📞 Wsparcie

Jeśli nadal masz problemy, sprawdź:
- Railway Docs: https://docs.railway.app/deploy/dockerfiles
- Railway Discord: https://discord.gg/railway

