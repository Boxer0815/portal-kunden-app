# portal-kunden-app

Expo-App für Kunden des Portals — Verträge, Produkte und Rechnungen auf dem iPhone.

## Voraussetzungen

- Node.js 20+
- Expo CLI (`npm install -g expo`)
- Expo Go auf dem iPhone (App Store)

## Lokale Einrichtung

```bash
cd portal-kunden-app
npm install
cp .env.example .env
# .env anpassen: KEYCLOAK_URL, BACKEND_URL, KEYCLOAK_CLIENT_ID
npm start
```

QR-Code mit Expo Go auf dem iPhone scannen.

## Konfiguration

Alle Hosts und Einstellungen kommen aus `.env` — keine hartcodierten Werte.
Vorlage: `.env.example`.

| Variable            | Bedeutung                        | Standardwert          |
|---------------------|----------------------------------|-----------------------|
| `KEYCLOAK_URL`      | Keycloak-Server-URL              | `http://localhost:8080` |
| `KEYCLOAK_REALM`    | Realm-Name                       | `portal`              |
| `KEYCLOAK_CLIENT_ID`| Client-ID für die Mobile-App     | `kunden-app`          |
| `BACKEND_URL`       | Backend-API-URL                  | `http://localhost:3001` |

## Keycloak-Client einrichten

Empfehlung: eigener Client `kunden-app` im Realm `portal`.
- Client-Protokoll: `openid-connect`
- Access-Type: `public` (kein Secret für native Apps)
- Valid redirect URIs: `kundenportal://*`
- PKCE aktivieren (S256)

## Zugangsberechtigung

Nur Nutzer mit mindestens einer Rolle, die mit `cust_` beginnt, können sich einloggen.
Andere Nutzer sehen einen Hinweisscreen.

## Screens

| Screen | Route | Datenquelle |
|---|---|---|
| Übersicht | `/(tabs)` | `GET /api/me` |
| Verträge | `/(tabs)/vertraege` | `GET /api/my-contracts` |
| Rechnungen | `/(tabs)/rechnungen` | `GET /api/invoices` |
| Rechnungsdetail | `/rechnung/[id]` | `GET /api/invoices/:id/items` |
| Login | `/login` | Keycloak OAuth2 PKCE |

## Build (EAS)

```bash
eas build --platform ios --profile preview
```
