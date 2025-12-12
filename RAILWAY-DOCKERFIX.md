# 🔧 Naprawa - Railway używa Dockerfile zamiast Nixpacks

## Problem
Railway automatycznie generuje Dockerfile z Nixpacks, ale ten Dockerfile nie ma Node.js zainstalowanego. Railway próbuje użyć tego wygenerowanego Dockerfile zamiast nixpacks.toml.

## ✅ Rozwiązanie

Utworzyłem poprawny `backend/Dockerfile` który Railway będzie używał.

## 📋 Co teraz zrobić:

### Opcja 1: Użyj Dockerfile (REKOMENDACJA - najszybsze)

1. **Wypchnij zmiany na GitHub:**
   ```bash
   git add backend/Dockerfile
   git commit -m "Add Dockerfile for Railway deployment"
   git push
   ```

2. **W Railway - Backend Service:**
   - Settings → Service
   - **Builder**: Wybierz "Dockerfile" (jeśli jest opcja)
   - **Root Directory**: `backend`
   - **Build Command**: (zostaw puste - Dockerfile to obsłuży)
   - **Start Command**: (zostaw puste - Dockerfile to obsłuży)

3. **Zrestartuj deploy:**
   - Deployments → Redeploy

### Opcja 2: Wymuś użycie Nixpacks

1. **W Railway - Backend Service:**
   - Settings → Service
   - **Builder**: Wybierz "Nixpacks" (jeśli jest opcja)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

2. **Upewnij się, że nixpacks.toml jest w backend/**
   - Railway powinien go automatycznie wykryć

3. **Zrestartuj deploy**

### Opcja 3: Usuń Dockerfile i użyj tylko Nixpacks

Jeśli Railway nadal używa Dockerfile mimo że chcesz Nixpacks:

1. **Usuń Dockerfile** (jeśli Railway go generuje automatycznie, nie możesz go usunąć)
2. **W Railway Settings:**
   - Znajdź opcję "Builder" lub "Build Method"
   - Wybierz "Nixpacks" zamiast "Dockerfile"

## 🔍 Sprawdź ustawienia Railway

1. **Backend Service → Settings → Service:**
   - Sprawdź czy jest opcja "Builder" lub "Build Method"
   - Jeśli tak, wybierz odpowiednią opcję

2. **Backend Service → Settings → Variables:**
   - Upewnij się, że wszystkie zmienne są ustawione:
     - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
     - `JWT_SECRET=...`
     - `NODE_ENV=production`
     - `PORT=3000`

## 📝 Dockerfile vs Nixpacks

**Dockerfile (utworzony):**
- ✅ Jawnie określa Node.js 20
- ✅ Działa od razu
- ✅ Railway preferuje Dockerfile jeśli istnieje

**Nixpacks:**
- ✅ Automatyczna konfiguracja
- ⚠️ Może być ignorowany jeśli Railway wykryje Dockerfile

**Rekomendacja:** Użyj Dockerfile - jest bardziej przewidywalny i Railway go preferuje.

## 🚀 Po wypchnięciu zmian

1. Railway automatycznie wykryje nowy Dockerfile
2. Zrestartuj deploy
3. Sprawdź logi - powinno działać!

