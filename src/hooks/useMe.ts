import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import type { MeinProfil } from '../types';

interface ApiMeResponse {
  sub?: string;
  name?: string;
  email?: string;
  accountName?: string;
  kundennummer?: string;
  roles?: string[];
}

export function useMe() {
  const [profil, setProfil] = useState<MeinProfil | null>(null);
  const [laedt, setLaedt]   = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback(async () => {
    setLaedt(true);
    setFehler(null);
    try {
      const daten = await apiFetch<ApiMeResponse>('/api/me');
      setProfil({
        sub:          daten.sub ?? '',
        name:         daten.name ?? '',
        email:        daten.email ?? '',
        accountName:  daten.accountName,
        kundennummer: daten.kundennummer,
        rollen:       daten.roles ?? [],
      });
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden des Profils');
    } finally {
      setLaedt(false);
    }
  }, []);

  return { profil, laedt, fehler, laden };
}
