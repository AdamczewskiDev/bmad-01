# 🔧 Naprawa błędu Nixpacks - "undefined variable 'npm'"

## Problem
Nixpacks próbuje zainstalować `npm` jako osobny pakiet, ale `npm` jest już częścią `nodejs_20` w NixOS. To powoduje błąd: `error: undefined variable 'npm'`.

## ✅ Rozwiązanie

Usunąłem `npm` z listy pakietów w `nixpacks.toml` - `nodejs_20` już zawiera `npm`.

## 📋 Co zostało naprawione:

**backend/nixpacks.toml:**
- ❌ Przed: `nixPkgs = ["nodejs_20", "npm"]`
- ✅ Teraz: `nixPkgs = ["nodejs_20"]`

`nodejs_20` automatycznie zawiera `npm`, więc nie trzeba go dodawać osobno.

## 🚀 Co teraz zrobić:

### Krok 1: Wypchnij zmiany

```bash
git add backend/nixpacks.toml
git commit -m "Fix nixpacks.toml - remove npm (included in nodejs_20)"
git push
```

### Krok 2: Zrestartuj Deploy w Railway

1. **Deployments** → kliknij **"Redeploy"**
2. **Sprawdź logi** - powinno działać! ✅

## 🔍 Co powinieneś zobaczyć w logach:

Po naprawie, logi powinny pokazać:
```
Using Nixpacks
[phases.setup]
Installing nodejs_20...
[phases.install]
Running: npm install
[phases.build]
Running: npm run build
```

## 📝 Pełna konfiguracja nixpacks.toml:

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]  # npm jest już w nodejs_20

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start:prod"
```

## ✅ To powinno teraz działać!

Wypchnij zmiany i zrestartuj deploy - błąd powinien zniknąć! 🎉

