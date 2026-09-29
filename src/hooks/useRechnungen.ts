import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import type { Rechnung, Rechnungsposition } from '../types';

export function useRechnungen() {
  const [rechnungen, setRechnungen] = useState<Rechnung[]>([]);
  const [laedt, setLaedt]           = useState(false);
  const [fehler, setFehler]         = useState<string | null>(null);

  const laden = useCallback(async () => {
    setLaedt(true);
    setFehler(null);
    try {
      const daten = await apiFetch<Rechnung[]>('/api/invoices');
      setRechnungen(Array.isArray(daten) ? daten : []);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden der Rechnungen');
    } finally {
      setLaedt(false);
    }
  }, []);

  return { rechnungen, laedt, fehler, laden };
}

export function useRechnungsdetail(dbId: number | null) {
  const [positionen, setPositionen] = useState<Rechnungsposition[]>([]);
  const [laedt, setLaedt]           = useState(false);
  const [fehler, setFehler]         = useState<string | null>(null);

  const laden = useCallback(async () => {
    if (dbId === null) return;
    setLaedt(true);
    setFehler(null);
    try {
      const daten = await apiFetch<Rechnungsposition[]>(`/api/invoices/${dbId}/items`);
      setPositionen(Array.isArray(daten) ? daten : []);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden der Positionen');
    } finally {
      setLaedt(false);
    }
  }, [dbId]);

  return { positionen, laedt, fehler, laden };
}
