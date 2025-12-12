# Code Review - Naprawa Throttling

**Data:** 2025-12-12  
**Problem:** Błąd "Zbyt wiele prób" pojawiał się na wszystkich endpointach, nie tylko autentykacji

## 🔴 Problem

1. **APP_GUARD jest zawsze globalny** - nawet jeśli jest zdefiniowany w module, działa na wszystkie endpointy
2. **Throttling był zbyt restrykcyjny** - 5 prób/15 min dla wszystkich endpointów
3. **Frontend wykonuje wiele requestów równolegle** - na stronie transakcji: 3 requesty (transakcje, portfele, kategorie)

## ✅ Rozwiązanie

### Zmiana 1: Usunięto APP_GUARD z auth.module.ts
- `APP_GUARD` w NestJS jest zawsze globalny, niezależnie od modułu
- Usunięto `APP_GUARD` z `auth.module.ts`

### Zmiana 2: Dodano @UseGuards(ThrottlerGuard) bezpośrednio na AuthController
- Throttling działa teraz tylko na endpointach `/auth/*`
- Użyto `@UseGuards(ThrottlerGuard)` na poziomie kontrolera

### Zmiana 3: Wyłączono globalny throttling
- Globalny `ThrottlerGuard` w `app.module.ts` jest wyłączony (zakomentowany)

## 📋 Pliki zmienione

1. ✅ `backend/src/auth/auth.module.ts` - usunięto `APP_GUARD`
2. ✅ `backend/src/auth/auth.controller.ts` - dodano `@UseGuards(ThrottlerGuard)`
3. ✅ `backend/src/app.module.ts` - globalny guard wyłączony (już było)

## 🎯 Rezultat

**Teraz:**
- ✅ Throttling tylko dla `/auth/*` endpointów:
  - `/auth/login`: 5 prób/15 min
  - `/auth/register`: 3 próby/godz
  - `/auth/forgot-password`: 3 próby/godz
  - `/auth/reset-password`: 5 prób/15 min
- ✅ Pozostałe endpointy (`/transactions`, `/wallets`, `/categories`, `/reports`): **bez throttlingu**

## ⚠️ Ważne

**Backend musi być zrestartowany** aby zmiany zadziałały:
```bash
cd backend
# Zatrzymaj obecny proces (Ctrl+C)
npm run start:dev
```

Throttling w pamięci (memory storage) resetuje się po restarcie serwera.

