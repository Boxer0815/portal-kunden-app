/**
 * Verträge & Produkte — lädt via GET /api/my-contracts.
 */
import {
  View, Text, FlatList, RefreshControl,
  StyleSheet, useColorScheme,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useVertraege } from '../../hooks/useVertraege';
import { StatusBadge, varianteVonOrderState } from '../../components/StatusBadge';
import { LeerZustand } from '../../components/LeerZustand';
import { colors, typography, spacing, radii } from '../../utils/theme';
import type { Vertrag } from '../../types';

function formatPreis(preis: number | null): string {
  if (preis === null) return '–';
  return preis.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) + ' / Monat';
}

export default function VertraegeScreen() {
  const dunkel = useColorScheme() === 'dark';
  const { vertraege, laedt, fehler, laden } = useVertraege();

  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  const hg      = dunkel ? colors.dark.background : colors.surfaceLight;
  const karteHg = dunkel ? colors.dark.surface    : colors.background;
  const textC   = dunkel ? colors.dark.text       : colors.text;
  const mutedC  = dunkel ? colors.dark.textMuted  : colors.textMuted;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: hg }}
      data={vertraege}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={laedt} onRefresh={laden} />}
      contentContainerStyle={vertraege.length === 0 ? { flex: 1 } : { padding: spacing.md, gap: spacing.sm }}
      ListHeaderComponent={fehler ? <Text style={styles.fehler}>{fehler}</Text> : null}
      ListEmptyComponent={
        <LeerZustand
          emoji="📄"
          titel="Keine Verträge"
          beschreibung="Es sind noch keine Verträge vorhanden."
        />
      }
      renderItem={({ item }: { item: Vertrag }) => (
        <View style={[styles.karte, { backgroundColor: karteHg }]}>
          {/* Header */}
          <View style={styles.zeile}>
            <Text style={[styles.vertragsnummer, { color: colors.primary }]}>
              {item.vertragsnummer}
            </Text>
            <StatusBadge
              label={item.tmfOrderState}
              variante={varianteVonOrderState(item.tmfOrderState)}
            />
          </View>

          <Text style={[styles.produktName, { color: textC }]} numberOfLines={2}>
            {item.produktName}
          </Text>

          <View style={styles.metaZeile}>
            <Text style={[styles.meta, { color: mutedC }]}>{item.laufzeitLabel}</Text>
            <Text style={[styles.preis, { color: textC }]}>{formatPreis(item.preis)}</Text>
          </View>

          {item.positionen.length > 1 && (
            <View style={styles.positionen}>
              {item.positionen.map((p) => (
                <Text key={p.id} style={[styles.position, { color: mutedC }]} numberOfLines={1}>
                  • {p.produktName}
                </Text>
              ))}
            </View>
          )}

          {item.kuendigungBeantragt && (
            <Text style={styles.kuendigung}>Kündigung beantragt</Text>
          )}
          {item.endOfContract && (
            <Text style={[styles.meta, { color: mutedC }]}>
              Vertragsende: {item.endOfContract}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  karte:           { borderRadius: radii.lg, padding: spacing.md, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  zeile:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  vertragsnummer:  { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  produktName:     { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, marginBottom: spacing.xs },
  metaZeile:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta:            { fontSize: typography.sizes.sm },
  preis:           { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  positionen:      { marginTop: spacing.xs, gap: 2 },
  position:        { fontSize: typography.sizes.sm },
  kuendigung:      { marginTop: spacing.xs, color: colors.danger, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  fehler:          { color: colors.danger, padding: spacing.md, textAlign: 'center' },
});
