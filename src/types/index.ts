// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null;
  rollen: string[];
  hatZugang: boolean;  // mind. eine cust_*-Rolle
  laedt: boolean;
}

// ─── Me / Profil ─────────────────────────────────────────────────────────────

export interface MeinProfil {
  sub: string;
  name: string;
  email: string;
  accountName?: string;
  kundennummer?: string;
  rollen: string[];
}

// ─── Verträge ────────────────────────────────────────────────────────────────

export interface Vertrag {
  id: string;
  vertragsnummer: string;
  produktName: string;
  laufzeitLabel: string;
  preis: number | null;
  tmfOrderState: string;
  kuendigungBeantragt: boolean;
  endOfContract: string | null;
  erstelltAm: string;
  positionen: { id: string; produktName: string; preis: number | null }[];
}

// ─── Rechnungen ──────────────────────────────────────────────────────────────

export type RechnungStatus = 'new' | 'validated' | 'sent' | 'partial' | 'settled' | 'cancelled' | string;

export interface Rechnung {
  dbId: number;
  id: string;           // Rechnungsnummer
  date: string;
  amount: string;       // formatierter Betrag z. B. "1.234,56 €"
  bruttoBetrag: number;
  status: string;
  tmfBillState: RechnungStatus;
  faelligkeitsdatum: string | null;
  billingPeriod: string | null;
}

export interface Rechnungsposition {
  beschreibung: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}
