/**
 * Rechnungsliste — lädt via GET /api/invoices.
 */
import {
  View, Text, FlatList, RefreshControl,
  TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useRechnungen } from '../../hooks/useRechnungen';
import { StatusBadge, varianteVonBillState } from '../../components/StatusBadge';
import { LeerZustand } from '../../components/LeerZustand';
import { colors, typography, spacing, radii } from '../../utils/theme';
import type { Rechnung } from '../../types';

function formatDatum(datum: string | null): string {
  if (!datum) return '–';
  try {
    return new Date(datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return datum; }
}

export default function RechnungenScreen() {
  const dunkel = useColorScheme() === 'dark';
  const { rechnungen, laedt, fehler, laden } = useRechnungen();
  const router = useRouter();

  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  const hg      = dunkel ? colors.dark.background : colors.surfaceLight;
  const karteHg = dunkel ? colors.dark.surface    : colors.background;
  const textC   = dunkel ? colors.dark.text       : colors.text;
  const mutedC  = dunkel ? colors.dark.textMuted  : colors.textMuted;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: hg }}
      data={rechnungen}
      keyExtractor={(item) => String(item.dbId)}
      refreshControl={<RefreshControl refreshing={laedt} onRefresh={laden} />}
      contentContainerStyle={rechnungen.length === 0 ? { flex: 1 } : { padding: spacing.md, gap: spacing.sm }}
      ListHeaderComponent={fehler ? <Text style={styles.fehler}>{fehler}</Text> : null}
      ListEmptyComponent={
        <LeerZustand
          emoji="🧾"
          titel="Keine Rechnungen"
          beschreibung="Es sind noch keine Rechnungen vorhanden."
        />
      }
      renderItem={({ item }: { item: Rechnung }) => (
        <TouchableOpacity
          style={[styles.karte, { backgroundColor: karteHg }]}
          onPress={() => router.push(`/rechnung/${item.dbId}`)}
          activeOpacity={0.7}
        >
          <View style={styles.zeile}>
            <Text style={[styles.rechnungsnummer, { color: colors.primary }]}>
              {item.id}
            </Text>
            <StatusBadge
              label={item.status || item.tmfBillState}
              variante={varianteVonBillState(item.tmfBillState)}
            />
          </View>

          <View style={styles.betragZeile}>
            <Text style={[styles.betrag, { color: textC }]}>{item.amount}</Text>
            <Text style={[styles.datum, { color: mutedC }]}>
              {formatDatum(item.date)}
            </Text>
          </View>

          {item.faelligkeitsdatum && (
            <Text style={[styles.faelligkeit, { color: mutedC }]}>
              Fällig: {formatDatum(item.faelligkeitsdatum)}
            </Text>
          )}
          {item.billingPeriod && (
            <Text style={[styles.periode, { color: mutedC }]}>
              Zeitraum: {item.billingPeriod}
            </Text>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  karte:           { borderRadius: radii.lg, padding: spacing.md, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  zeile:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  rechnungsnummer: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  betragZeile:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  betrag:          { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  datum:           { fontSize: typography.sizes.sm },
  faelligkeit:     { fontSize: typography.sizes.sm, marginTop: 2 },
  periode:         { fontSize: typography.sizes.sm, marginTop: 2 },
  fehler:          { color: colors.danger, padding: spacing.md, textAlign: 'center' },
});
