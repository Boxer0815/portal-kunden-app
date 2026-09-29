import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL, KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } from './config';

const ACCESS_KEY  = 'kunden_access_token';
const REFRESH_KEY = 'kunden_refresh_token';
const EXPIRY_KEY  = 'kunden_token_expiry';

export async function speichereTokens(access: string, refresh: string, expiresIn: number) {
  const ablauf = Date.now() + expiresIn * 1000;
  await SecureStore.setItemAsync(ACCESS_KEY, access);
  await SecureStore.setItemAsync(REFRESH_KEY, refresh);
  await SecureStore.setItemAsync(EXPIRY_KEY, String(ablauf));
}

export async function ladeAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function ladeRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function loescheTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(EXPIRY_KEY);
}

async function tokenIstAbgelaufen(): Promise<boolean> {
  const ablauf = await SecureStore.getItemAsync(EXPIRY_KEY);
  if (!ablauf) return true;
  // 30 Sekunden Puffer
  return Date.now() > Number(ablauf) - 30_000;
}

/** Erneuert den Access-Token via Refresh-Token. */
async function erneuereToken(): Promise<string | null> {
  const refreshToken = await ladeRefreshToken();
  if (!refreshToken) return null;

  const url = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    client_id:     KEYCLOAK_CLIENT_ID,
    refresh_token: refreshToken,
  });

  const antwort = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!antwort.ok) {
    await loescheTokens();
    return null;
  }

  const daten = await antwort.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  await speichereTokens(daten.access_token, daten.refresh_token, daten.expires_in);
  return daten.access_token;
}

/** Authentifizierter Fetch gegen das Backend mit automatischem Token-Refresh. */
export async function apiFetch<T = unknown>(
  pfad: string,
  optionen: RequestInit = {},
): Promise<T> {
  let token = await ladeAccessToken();
  if (!token) throw new Error('Nicht authentifiziert');

  if (await tokenIstAbgelaufen()) {
    token = await erneuereToken();
    if (!token) throw new Error('Sitzung abgelaufen – bitte erneut anmelden');
  }

  const antwort = await fetch(`${BACKEND_URL}${pfad}`, {
    ...optionen,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...optionen.headers,
    },
  });

  if (!antwort.ok) {
    let meldung = `HTTP ${antwort.status}`;
    try {
      const body = await antwort.json() as { error?: string };
      if (body?.error) meldung = body.error;
    } catch { /* ignorieren */ }
    throw new Error(meldung);
  }

  if (antwort.status === 204) return null as T;
  return antwort.json() as Promise<T>;
}
