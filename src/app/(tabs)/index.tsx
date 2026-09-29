/**
 * Übersicht — erster Screen nach dem Login.
 * Lädt Profildaten via GET /api/me (echter Backend-Endpunkt).
 */
import {
  View, Text, ScrollView, RefreshControl,
  TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useMe } from '../../hooks/useMe';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing, radii } from '../../utils/theme';

export default function UebersichtScreen() {
  const dunkel = useColorScheme() === 'dark';
  const { profil, laedt, fehler, laden } = useMe();
  const { logout } = useAuth();
  const router = useRouter();

  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  const hg      = dunkel ? colors.dark.background : colors.surfaceLight;
  const karteHg = dunkel ? colors.dark.surface    : colors.background;
  const textC   = dunkel ? colors.dark.text       : colors.text;
  const mutedC  = dunkel ? colors.dark.textMuted  : colors.textMuted;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: hg }}
      refreshControl={<RefreshControl refreshing={laedt} onRefresh={laden} />}
    >
      {/* Begrüßungs-Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerGruss}>Willkommen,</Text>
        <Text style={styles.headerName} numberOfLines={1}>
          {profil?.name ?? '…'}
        </Text>
        {profil?.accountName && (
          <Text style={styles.headerAccount}>{profil.accountName}</Text>
        )}
      </View>

      {fehler && (
        <Text style={styles.fehler}>{fehler}</Text>
      )}

      {/* Profilkarte */}
      {profil && (
        <View style={[styles.karte, { backgroundColor: karteHg }]}>
          <Text style={[styles.abschnittTitel, { color: mutedC }]}>Ihr Konto</Text>
          <Zeile label="Name"         wert={profil.name}         textC={textC} mutedC={mutedC} />
          <Zeile label="E-Mail"       wert={profil.email}        textC={textC} mutedC={mutedC} />
          {profil.kundennummer && (
            <Zeile label="Kundennummer" wert={profil.kundennummer} textC={textC} mutedC={mutedC} />
          )}
          {profil.accountName && (
            <Zeile label="Unternehmen" wert={profil.accountName}  textC={textC} mutedC={mutedC} />
          )}
        </View>
      )}

      {/* Schnellzugriff */}
      <View style={[styles.karte, { backgroundColor: karteHg }]}>
        <Text style={[styles.abschnittTitel, { color: mutedC }]}>Schnellzugriff</Text>
        <View style={styles.quickGrid}>
          <QuickButton emoji="📄" label="Verträge"   onPress={() => router.push('/(tabs)/vertraege')} />
          <QuickButton emoji="🧾" label="Rechnungen" onPress={() => router.push('/(tabs)/rechnungen')} />
        </View>
      </View>

      {/* Abmelden */}
      <TouchableOpacity style={styles.abmeldenButton} onPress={logout}>
        <Text style={styles.abmeldenText}>Abmelden</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Zeile({ label, wert, textC, mutedC }: { label: string; wert: string; textC: string; mutedC: string }) {
  return (
    <View style={styles.zeile}>
      <Text style={[styles.zeilenLabel, { color: mutedC }]}>{label}</Text>
      <Text style={[styles.zeilenWert, { color: textC }]}>{wert}</Text>
    </View>
  );
}

function QuickButton({ emoji, label, onPress }: { emoji: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.quickButton, { backgroundColor: colors.primaryBg }]} onPress={onPress}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={{ color: colors.primary, fontWeight: typography.weights.semibold, fontSize: typography.sizes.sm }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header:         { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  headerGruss:    { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.md },
  headerName:     { color: colors.primaryText, fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, marginTop: 2 },
  headerAccount:  { color: 'rgba(255,255,255,0.7)', fontSize: typography.sizes.sm, marginTop: 2 },
  karte:          { margin: spacing.md, marginTop: 0, marginBottom: spacing.sm, borderRadius: radii.lg, padding: spacing.md, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  abschnittTitel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  zeile:          { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  zeilenLabel:    { fontSize: typography.sizes.sm },
  zeilenWert:     { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, maxWidth: '60%', textAlign: 'right' },
  quickGrid:      { flexDirection: 'row', gap: spacing.sm },
  quickButton:    { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: radii.md, gap: spacing.xs },
  abmeldenButton: { margin: spacing.md, marginTop: spacing.xs, padding: spacing.md, alignItems: 'center' },
  abmeldenText:   { color: colors.danger, fontSize: typography.sizes.md, fontWeight: typography.weights.medium },
  fehler:         { color: colors.danger, padding: spacing.md, textAlign: 'center' },
});
