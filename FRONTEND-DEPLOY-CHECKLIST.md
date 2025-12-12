# ✅ Checklist: Deploy Frontendu na Railway

## Krok 1: Dodaj Frontend Service ⏳

### W Railway Dashboard:

- [ ] Kliknij "+ New" → "GitHub Repo"
- [ ] Wybierz repozytorium `b-home`
- [ ] Kliknij na nowo utworzony serwis
- [ ] Settings → Service:
  - [ ] **Name:** `frontend`
  - [ ] **Root Directory:** `frontend`
  - [ ] **Build Command:** `npm install && npm run build` (lub zostaw puste - nixpacks.toml to obsłuży)
  - [ ] **Start Command:** `npm run start` (lub zostaw puste - nixpacks.toml to obsłuży)
- [ ] Sprawdź logi build - powinno działać ✅

---

## Krok 2: Skonfiguruj Zmienne Środowiskowe ⏳

### 2.1 Znajdź URL Backendu:

- [ ] Otwórz serwis "backend" w Railway
- [ ] Settings → Networking
- [ ] Skopiuj "Public Domain" (np. `backend-production-xxxx.up.railway.app`)
- [ ] **Zapisz ten URL** 📝

### 2.2 Ustaw zmienne w Frontend:

- [ ] Otwórz serwis "frontend" w Railway
- [ ] Settings → Variables
- [ ] Dodaj zmienną:
  - **Name:** `NEXT_PUBLIC_API_URL`
  - **Value:** `https://twoj-backend-url.railway.app` (zamień na rzeczywisty URL!)
- [ ] Dodaj zmienną:
  - **Name:** `NODE_ENV`
  - **Value:** `production`

### 2.3 Zaktualizuj FRONTEND_URL w Backend:

- [ ] Otwórz serwis "frontend" → Settings → Networking
- [ ] Skopiuj "Public Domain" frontendu
- [ ] Otwórz serwis "backend" → Settings → Variables
- [ ] Znajdź/edytuj zmienną `FRONTEND_URL`
- [ ] Ustaw na URL frontendu (np. `https://frontend-production-xxxx.up.railway.app`)
- [ ] Zrestartuj backend (Settings → Restart)

---

## Krok 3: Przetestuj Aplikację ⏳

### 3.1 Sprawdź URL-e:

- [ ] Backend URL: `https://...` (otwórz w przeglądarce)
- [ ] Frontend URL: `https://...` (otwórz w przeglądarce)
- [ ] Swagger API: `https://backend-url.railway.app/api` (powinno działać)

### 3.2 Test Rejestracji:

- [ ] Otwórz frontend w przeglądarce
- [ ] Kliknij "Register" lub przejdź do `/auth/register`
- [ ] Wypełnij formularz:
  - Email: `test@example.com`
  - Hasło: `Test123!` (lub inne)
- [ ] Kliknij "Register"
- [ ] **Powinieneś zostać zalogowany** ✅

### 3.3 Test Logowania:

- [ ] Wyloguj się (jeśli jesteś zalogowany)
- [ ] Kliknij "Login" lub przejdź do `/auth/login`
- [ ] Wpisz dane z rejestracji
- [ ] Kliknij "Login"
- [ ] **Powinieneś zostać zalogowany** ✅

### 3.4 Test Portfeli:

- [ ] Po zalogowaniu powinieneś zobaczyć dashboard
- [ ] Kliknij "Utwórz portfel" lub podobny przycisk
- [ ] Wypełnij formularz:
  - Nazwa: `Portfel Testowy`
  - Waluta bazowa: `PLN`
- [ ] Kliknij "Zapisz"
- [ ] **Portfel powinien się utworzyć** ✅

### 3.5 Test Transakcji:

- [ ] Przejdź do sekcji transakcji
- [ ] Kliknij "Dodaj transakcję"
- [ ] Wypełnij formularz:
  - Typ: `Wydatek`
  - Kwota: `100`
  - Waluta: `PLN`
  - Kategoria: wybierz z listy
  - Portfel: wybierz utworzony portfel
- [ ] Kliknij "Zapisz"
- [ ] **Transakcja powinna się dodać** ✅

### 3.6 Test Raportów:

- [ ] Przejdź do sekcji raportów
- [ ] Sprawdź czy dane się wyświetlają
- [ ] **Raporty powinny działać** ✅

---

## 🔧 Jeśli coś nie działa:

### Frontend nie łączy się z backendem:

- [ ] Sprawdź `NEXT_PUBLIC_API_URL` w zmiennych frontendu
- [ ] Sprawdź `FRONTEND_URL` w zmiennych backendu
- [ ] Sprawdź konsolę przeglądarki (F12) - błędy CORS?
- [ ] Sprawdź czy backend działa (otwórz URL w przeglądarce)

### Frontend nie buduje się:

- [ ] Sprawdź logi build w Railway
- [ ] Sprawdź czy build działa lokalnie (`cd frontend && npm run build`)

### Błędy autentykacji:

- [ ] Sprawdź czy `JWT_SECRET` jest ustawione w backendzie
- [ ] Sprawdź logi backendu w Railway

---

## ✅ Wszystko gotowe!

Jeśli wszystkie checkboxy są zaznaczone, aplikacja jest w pełni wdrożona i działa! 🎉

---

**Powodzenia! 🚀**

