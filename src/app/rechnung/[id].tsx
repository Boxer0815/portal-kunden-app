/**
 * Rechnungsdetail — lädt Positionen via GET /api/invoices/:id/items.
 */
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet, useColorScheme,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useRechnungen, useRechnungsdetail } from '../../hooks/useRechnungen';
import { StatusBadge, varianteVonBillState } from '../../components/StatusBadge';
import { colors, typography, spacing, radii } from '../../utils/theme';
import type { Rechnung } from '../../types';

function formatDatum(datum: string | null): string {
  if (!datum) return '–';
  try {
    return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return datum; }
}

function formatEuro(wert: number): string {
  return wert.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export default function RechnungsdetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dbId   = id ? Number(id) : null;

  const { rechnungen, laden: rechnungenLaden } = useRechnungen();
  const { positionen, laedt, fehler, laden }   = useRechnungsdetail(dbId);

  const rechnung: Rechnung | undefined = rechnungen.find((r) => r.dbId === dbId);

  useEffect(() => {
    if (!rechnung) rechnungenLaden();
    laden();
  }, [dbId]);

  const dunkel  = useColorScheme() === 'dark';
  const hg      = dunkel ? colors.dark.background : colors.surfaceLight;
  const karteHg = dunkel ? colors.dark.surface    : colors.background;
  const textC   = dunkel ? colors.dark.text       : colors.text;
  const mutedC  = dunkel ? colors.dark.textMuted  : colors.textMuted;
  const borderC = dunkel ? colors.dark.border     : colors.border;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: hg }}
      refreshControl={<RefreshControl refreshing={laedt} onRefresh={laden} />}
    >
      {/* Kopfbereich */}
      {rechnung && (
        <View style={[styles.karte, { backgroundColor: karteHg }]}>
          <View style={styles.zeile}>
            <Text style={[styles.rechnungsnummer, { color: colors.primary }]}>{rechnung.id}</Text>
            <StatusBadge
              label={rechnung.status || rechnung.tmfBillState}
              variante={varianteVonBillState(rechnung.tmfBillState)}
            />
          </View>
          <Text style={[styles.betrag, { color: textC }]}>{rechnung.amount}</Text>

          <View style={[styles.trennlinie, { backgroundColor: borderC }]} />

          <MetaZeile label="Rechnungsdatum"  wert={formatDatum(rechnung.date)}              mutedC={mutedC} textC={textC} />
          {rechnung.faelligkeitsdatum && (
            <MetaZeile label="Fällig am"       wert={formatDatum(rechnung.faelligkeitsdatum)} mutedC={mutedC} textC={textC} />
          )}
          {rechnung.billingPeriod && (
            <MetaZeile label="Abrechnungszeitraum" wert={rechnung.billingPeriod}             mutedC={mutedC} textC={textC} />
          )}
        </View>
      )}

      {/* Positionen */}
      <View style={[styles.karte, { backgroundColor: karteHg, marginTop: spacing.sm }]}>
        <Text style={[styles.abschnittTitel, { color: mutedC }]}>Positionen</Text>

        {fehler && <Text style={styles.fehler}>{fehler}</Text>}

        {positionen.length === 0 && !laedt && !fehler && (
          <Text style={[styles.leer, { color: mutedC }]}>Keine Positionen geladen.</Text>
        )}

        {positionen.map((pos, i) => (
          <View key={i} style={[styles.position, { borderBottomColor: borderC }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.positionBeschreibung, { color: textC }]}>{pos.beschreibung}</Text>
              <Text style={[styles.positionMenge, { color: mutedC }]}>
                {pos.menge} × {formatEuro(pos.einzelpreis)}
              </Text>
            </View>
            <Text style={[styles.positionSumme, { color: textC }]}>
              {formatEuro(pos.gesamtpreis)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function MetaZeile({ label, wert, mutedC, textC }: { label: string; wert: string; mutedC: string; textC: string }) {
  return (
    <View style={styles.metaZeile}>
      <Text style={[styles.metaLabel, { color: mutedC }]}>{label}</Text>
      <Text style={[styles.metaWert, { color: textC }]}>{wert}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  karte:                 { margin: spacing.md, marginBottom: 0, borderRadius: radii.lg, padding: spacing.md, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  zeile:                 { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  rechnungsnummer:       { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  betrag:                { fontSize: typography.sizes.xxl + 4, fontWeight: typography.weights.bold, marginBottom: spacing.sm },
  trennlinie:            { height: StyleSheet.hairlineWidth, marginVertical: spacing.sm },
  metaZeile:             { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  metaLabel:             { fontSize: typography.sizes.sm },
  metaWert:              { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium },
  abschnittTitel:        { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  position:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  positionBeschreibung:  { fontSize: typography.sizes.md },
  positionMenge:         { fontSize: typography.sizes.sm, marginTop: 2 },
  positionSumme:         { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, marginLeft: spacing.sm },
  leer:                  { fontSize: typography.sizes.sm, fontStyle: 'italic', textAlign: 'center', padding: spacing.md },
  fehler:                { color: colors.danger, padding: spacing.sm, textAlign: 'center' },
});
