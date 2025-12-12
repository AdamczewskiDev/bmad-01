# 🔧 Naprawa - Railway nie znajduje Dockerfile

## Problem
Railway pokazuje błąd: `Dockerfile 'Dockerfile' does not exist`, mimo że plik istnieje w `backend/Dockerfile`.

## ✅ Rozwiązanie - Użyj Nixpacks zamiast Dockerfile

Railway ma problem z lokalizacją Dockerfile gdy Root Directory jest ustawione. Najlepsze rozwiązanie to użyć **Nixpacks** - mamy już skonfigurowany `nixpacks.toml`.

## 📋 Co zrobić:

### Krok 1: Zaktualizuj railway.json (JUŻ ZROBIONE)

`backend/railway.json` został zaktualizowany aby używać Nixpacks zamiast Dockerfile.

### Krok 2: W Railway - Zmień Builder na Nixpacks

1. **Otwórz Backend Service** w Railway
2. **Settings → Service**
3. **Znajdź opcję "Builder"** lub **"Build Method"**
4. **Wybierz "Nixpacks"** (zamiast Dockerfile)
5. **Upewnij się, że:**
   - **Root Directory**: `backend` ✅
   - **Build Command**: (zostaw puste - nixpacks.toml to obsłuży)
   - **Start Command**: (zostaw puste - nixpacks.toml to obsłuży)

### Krok 3: Wypchnij zmiany

```bash
git add backend/railway.json
git commit -m "Switch to Nixpacks builder for Railway"
git push
```

### Krok 4: Zrestartuj Deploy

1. **Deployments** → kliknij **"Redeploy"**
2. **Sprawdź logi** - powinno działać! ✅

## 🎯 Dlaczego Nixpacks?

- ✅ Automatycznie wykrywa Node.js z `package.json` i `nixpacks.toml`
- ✅ Nie ma problemów z lokalizacją plików
- ✅ Łatwiejsza konfiguracja
- ✅ Mamy już `nixpacks.toml` skonfigurowany

## 🔍 Jeśli nadal nie działa:

### Sprawdź czy nixpacks.toml jest w repozytorium:

```bash
git ls-files | grep nixpacks
# Powinno pokazać: backend/nixpacks.toml
```

### Sprawdź logi w Railway:

1. **Deployments** → wybierz deployment → **View Logs**
2. Szukaj linii: `Using Nixpacks` - powinno pokazać konfigurację
3. Sprawdź czy Node.js jest wykryty

### Alternatywa: Usuń Dockerfile i użyj tylko Nixpacks

Jeśli Railway nadal próbuje użyć Dockerfile:

1. **W Railway Settings:**
   - Upewnij się, że Builder = "Nixpacks"
   - Usuń Build Command i Start Command (zostaw puste)

2. **Sprawdź czy nixpacks.toml jest poprawny:**
   - Powinien być w `backend/nixpacks.toml`
   - Powinien zawierać konfigurację Node.js 20

## 📝 Co mamy:

1. ✅ `backend/nixpacks.toml` - konfiguracja Nixpacks z Node.js 20
2. ✅ `backend/package.json` - z `engines` wskazującymi Node.js 20
3. ✅ `backend/.nvmrc` - wersja Node.js 20
4. ✅ `backend/railway.json` - konfiguracja wymuszająca Nixpacks

## 🚀 Po zmianach:

Railway powinien:
1. Wykryć `nixpacks.toml` w folderze `backend/`
2. Użyć Node.js 20 z konfiguracji
3. Zainstalować zależności (`npm install`)
4. Zbudować aplikację (`npm run build`)
5. Uruchomić aplikację (`npm run start:prod`)

---

**Wypchnij zmiany i zrestartuj deploy - powinno działać!** ✅

