# ✅ Railway Setup Checklist

Użyj tego checklistu krok po kroku podczas konfiguracji Railway.

## 📋 Przed Startem

- [ ] Projekt jest na GitHub
- [ ] Build backendu działa lokalnie (`cd backend && npm run build`)
- [ ] Build frontendu działa lokalnie (`cd frontend && npm run build`)
- [ ] Masz konto na Railway (railway.app)

---

## 🗄️ Krok 1: Baza Danych

- [ ] Zalogowałem się na Railway
- [ ] Utworzyłem nowy projekt z GitHub repo
- [ ] Dodałem PostgreSQL Database
- [ ] Sprawdziłem że Postgres ma status "Active" (zielony)
- [ ] Sprawdziłem że `DATABASE_URL` istnieje w zmiennych Postgres

---

## 🔧 Krok 2: Backend Service

- [ ] Dodałem nowy serwis z GitHub repo
- [ ] Ustawiłem **Name**: `backend`
- [ ] Ustawiłem **Root Directory**: `backend`
- [ ] Ustawiłem **Build Command**: `npm install && npm run build`
- [ ] Ustawiłem **Start Command**: `npm run start:prod`
- [ ] Dodałem zmienną `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- [ ] Dodałem zmienną `JWT_SECRET` = (32+ znaki)
- [ ] Dodałem zmienną `NODE_ENV` = `production`
- [ ] Dodałem zmienną `PORT` = `3000`
- [ ] Dodałem zmienną `FRONTEND_URL` = (placeholder na razie)
- [ ] Sprawdziłem logi - backend startuje bez błędów
- [ ] Sprawdziłem URL backendu (Settings → Networking → Public Domain)

---

## 🎨 Krok 3: Frontend Service

- [ ] Dodałem nowy serwis z GitHub repo
- [ ] Ustawiłem **Name**: `frontend`
- [ ] Ustawiłem **Root Directory**: `frontend`
- [ ] Ustawiłem **Build Command**: `npm install && npm run build`
- [ ] Ustawiłem **Start Command**: `npm run start`
- [ ] Dodałem zmienną `NEXT_PUBLIC_API_URL` = (URL backendu)
- [ ] Dodałem zmienną `NODE_ENV` = `production`
- [ ] Sprawdziłem logi - frontend startuje bez błędów
- [ ] Sprawdziłem URL frontendu (Settings → Networking → Public Domain)

---

## 🔗 Krok 4: Połączenie

- [ ] Zaktualizowałem `FRONTEND_URL` w backendzie (na URL frontendu)
- [ ] Zrestartowałem backend (Settings → Restart)
- [ ] Otworzyłem URL frontendu w przeglądarce
- [ ] Aplikacja się ładuje ✅
- [ ] Sprawdziłem Swagger API: `https://backend-url.railway.app/api`

---

## 🧪 Krok 5: Testowanie

- [ ] Zarejestrowałem nowego użytkownika
- [ ] Zalogowałem się
- [ ] Utworzyłem portfel
- [ ] Dodałem transakcję
- [ ] Sprawdziłem czy wszystko działa

---

## 🐛 Jeśli coś nie działa:

### Backend nie startuje
- [ ] Sprawdziłem logi backendu
- [ ] Sprawdziłem czy `DATABASE_URL` jest ustawione
- [ ] Sprawdziłem czy `JWT_SECRET` ma min 32 znaki
- [ ] Sprawdziłem czy `PORT` jest ustawione

### Frontend nie łączy się z backendem
- [ ] Sprawdziłem `NEXT_PUBLIC_API_URL` w frontendzie
- [ ] Sprawdziłem `FRONTEND_URL` w backendzie
- [ ] Sprawdziłem konsolę przeglądarki (F12) - błędy CORS?
- [ ] Sprawdziłem czy backend działa (otwórz URL w przeglądarce)

### Build się nie powodzi
- [ ] Sprawdziłem logi build
- [ ] Sprawdziłem czy build działa lokalnie
- [ ] Sprawdziłem czy wszystkie zależności są w package.json

---

## ✅ Wszystko Gotowe!

- [ ] Aplikacja działa na Railway
- [ ] Backend odpowiada
- [ ] Frontend łączy się z backendem
- [ ] Baza danych działa
- [ ] Automatyczny deploy z GitHub działa

**🎉 Gratulacje! Twoja aplikacja jest wdrożona!**

