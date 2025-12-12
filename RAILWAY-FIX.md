# 🔧 Naprawa błędu "npm: command not found" na Railway

## Problem
Railway/Nixpacks nie wykrywa Node.js podczas buildowania, co powoduje błąd:
```
/bin/bash: line 1: npm: command not found
```

## ✅ Rozwiązanie

Dodałem następujące pliki i zmiany:

1. **`backend/package.json`** - dodałem sekcję `engines`:
   ```json
   "engines": {
     "node": ">=20.0.0",
     "npm": ">=10.0.0"
   }
   ```

2. **`backend/.nvmrc`** - plik wskazujący wersję Node.js (20)

3. **`backend/nixpacks.toml`** - konfiguracja Nixpacks z jawnym wskazaniem Node.js

## 📋 Co teraz zrobić:

### Opcja 1: Użyj nixpacks.toml (REKOMENDACJA)

1. **W Railway, w ustawieniach Backend Service:**
   - Upewnij się, że **Root Directory** jest ustawione na: `backend`
   - **Build Command**: zostaw puste (nixpacks.toml to obsłuży)
   - **Start Command**: zostaw puste (nixpacks.toml to obsłuży)

2. **Lub usuń Build/Start Command całkowicie** - Railway użyje nixpacks.toml automatycznie

3. **Zrestartuj deploy:**
   - Kliknij "Deployments"
   - Kliknij "Redeploy" na ostatnim deployment

### Opcja 2: Sprawdź ustawienia Railway

Jeśli nadal nie działa, sprawdź:

1. **Settings → Service:**
   - **Root Directory**: `backend` (WAŻNE!)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

2. **Settings → Variables:**
   - Upewnij się, że wszystkie zmienne są ustawione

3. **Sprawdź czy pliki są w repozytorium:**
   ```bash
   git add backend/package.json backend/.nvmrc backend/nixpacks.toml
   git commit -m "Fix Railway Node.js detection"
   git push
   ```

### Opcja 3: Wymuś użycie Nixpacks

1. W Railway → Backend Service → Settings
2. Znajdź sekcję **"Build"** lub **"Builder"**
3. Upewnij się, że wybrane jest **"Nixpacks"** (nie Dockerfile)

## 🔍 Debugowanie

Jeśli nadal nie działa:

1. **Sprawdź logi build:**
   - Railway → Backend → Deployments → wybierz deployment → View Logs
   - Szukaj linii z "Using Nixpacks" - powinno pokazać konfigurację

2. **Sprawdź czy pliki są widoczne:**
   - Railway kopiuje pliki z Root Directory
   - Jeśli Root Directory = `backend`, to pliki w `backend/` powinny być widoczne

3. **Sprawdź czy package.json jest w Root Directory:**
   - Railway szuka `package.json` w Root Directory
   - Jeśli Root Directory = `backend`, to `backend/package.json` powinien być widoczny

## 📝 Alternatywne rozwiązanie (jeśli nadal nie działa)

Jeśli nadal masz problemy, możesz użyć Dockerfile:

1. Utwórz `backend/Dockerfile`:
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "run", "start:prod"]
   ```

2. W Railway → Settings → Builder → wybierz "Dockerfile"

Ale najpierw spróbuj z nixpacks.toml - powinno zadziałać!

