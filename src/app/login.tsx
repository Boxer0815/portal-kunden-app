import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, typography, spacing, radii } from '../utils/theme';

export default function LoginScreen() {
  const { login, loginBereit, laedt } = useAuth();
  const dunkel = useColorScheme() === 'dark';
  const hg     = dunkel ? colors.dark.background : colors.background;
  const textC  = dunkel ? colors.dark.text        : colors.text;
  const mutedC = dunkel ? colors.dark.textMuted   : colors.textMuted;

  return (
    <View style={[styles.container, { backgroundColor: hg }]}>
      <Text style={styles.logo}>🏢</Text>
      <Text style={[styles.titel, { color: textC }]}>Kundenportal</Text>
      <Text style={[styles.untertitel, { color: mutedC }]}>
        Ihre Verträge, Produkte und Rechnungen immer dabei.
      </Text>

      {laedt ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <TouchableOpacity
          style={[styles.button, !loginBereit && styles.buttonDeaktiviert]}
          onPress={login}
          disabled={!loginBereit}
        >
          <Text style={styles.buttonText}>Anmelden</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  logo:               { fontSize: 64 },
  titel:              { fontSize: typography.sizes.hero, fontWeight: typography.weights.bold },
  untertitel:         { fontSize: typography.sizes.md, textAlign: 'center', marginBottom: spacing.md },
  button:             { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 6, borderRadius: radii.lg, marginTop: spacing.md },
  buttonDeaktiviert:  { opacity: 0.5 },
  buttonText:         { color: colors.primaryText, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold },
});
