import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radii, spacing } from '../utils/theme';

type Variante = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const VARIANTEN: Record<Variante, { hg: string; text: string }> = {
  success: { hg: colors.successBg, text: colors.success },
  warning: { hg: colors.warningBg, text: colors.warning },
  danger:  { hg: colors.dangerBg,  text: colors.danger  },
  info:    { hg: colors.infoBg,    text: colors.info     },
  neutral: { hg: colors.surfaceLight, text: colors.textMuted },
};

/** Ordnet einen TMF-Status einer Variante zu. */
export function varianteVonOrderState(state: string): Variante {
  switch (state) {
    case 'completed': return 'success';
    case 'inProgress':
    case 'pending':   return 'warning';
    case 'rejected':
    case 'cancelled': return 'danger';
    default:          return 'neutral';
  }
}

export function varianteVonBillState(state: string): Variante {
  switch (state) {
    case 'settled':   return 'success';
    case 'partial':   return 'warning';
    case 'cancelled': return 'danger';
    case 'new':
    case 'sent':      return 'info';
    default:          return 'neutral';
  }
}

interface Props {
  label: string;
  variante?: Variante;
}

export function StatusBadge({ label, variante = 'neutral' }: Props) {
  const { hg, text } = VARIANTEN[variante];
  return (
    <View style={[styles.badge, { backgroundColor: hg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
