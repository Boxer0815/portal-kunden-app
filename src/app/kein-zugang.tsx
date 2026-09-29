import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, typography, spacing, radii } from '../utils/theme';

export default function KeinZugangScreen() {
  const { logout, rollen } = useAuth();
  const dunkel = useColorScheme() === 'dark';
  const hg     = dunkel ? colors.dark.background : colors.background;
  const textC  = dunkel ? colors.dark.text        : colors.text;
  const mutedC = dunkel ? colors.dark.textMuted   : colors.textMuted;

  return (
    <View style={[styles.container, { backgroundColor: hg }]}>
      <Text style={styles.emoji}>🚫</Text>
      <Text style={[styles.titel, { color: textC }]}>Kein Zugang</Text>
      <Text style={[styles.text, { color: mutedC }]}>
        Dieses Konto ist nicht für das Kundenportal freigeschaltet.{'\n\n'}
        Für Zugang wird eine Kundenrolle benötigt (cust_…).
        Bitte wenden Sie sich an Ihren Ansprechpartner.
      </Text>
      {rollen.length > 0 && (
        <Text style={[styles.rollenHinweis, { color: mutedC }]}>
          Ihre Rollen: {rollen.join(', ')}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Abmelden</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emoji:        { fontSize: 56 },
  titel:        { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold },
  text:         { fontSize: typography.sizes.md, textAlign: 'center', lineHeight: 22 },
  rollenHinweis:{ fontSize: typography.sizes.xs, fontStyle: 'italic', textAlign: 'center' },
  button:       { marginTop: spacing.lg, backgroundColor: colors.danger, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4, borderRadius: radii.md },
  buttonText:   { color: '#FFF', fontWeight: typography.weights.semibold, fontSize: typography.sizes.md },
});
