import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../utils/theme';

interface Props {
  emoji?: string;
  titel: string;
  beschreibung?: string;
}

export function LeerZustand({ emoji = '📭', titel, beschreibung }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.titel}>{titel}</Text>
      {beschreibung && <Text style={styles.beschreibung}>{beschreibung}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emoji:       { fontSize: 48 },
  titel:       { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, textAlign: 'center', color: colors.text },
  beschreibung:{ fontSize: typography.sizes.sm, textAlign: 'center', color: colors.textMuted },
});
