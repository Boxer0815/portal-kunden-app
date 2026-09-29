import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import type { Vertrag } from '../types';

export function useVertraege() {
  const [vertraege, setVertraege] = useState<Vertrag[]>([]);
  const [laedt, setLaedt]         = useState(false);
  const [fehler, setFehler]       = useState<string | null>(null);

  const laden = useCallback(async () => {
    setLaedt(true);
    setFehler(null);
    try {
      const daten = await apiFetch<Vertrag[]>('/api/my-contracts');
      setVertraege(Array.isArray(daten) ? daten : []);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden der Verträge');
    } finally {
      setLaedt(false);
    }
  }, []);

  return { vertraege, laedt, fehler, laden };
}
