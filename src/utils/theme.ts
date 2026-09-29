/**
 * Zentrale Theme-Datei — Portal-Designvorgaben für die Kunden-App.
 * Alle Farben, Radien und Abstände kommen von hier.
 * Quelle: CSS-Variablen aus portal/frontend/src/App.css
 */

export const colors = {
  // Primärfarben (Portal-Brand)
  primary:        '#1E5BB8',
  primaryDark:    '#163E73',
  primaryBg:      '#E7F0FA',
  primaryText:    '#FFFFFF',
  secondary:      '#17B2C7',

  // Neutrale Töne
  text:           '#111111',
  textMuted:      '#555555',
  border:         '#CCCCCC',
  background:     '#FFFFFF',
  surfaceLight:   '#F5F5F5',

  // Semantische Farben
  success:        '#16A34A',
  successBg:      '#DCFCE7',
  danger:         '#DC2626',
  dangerBg:       '#FEE2E2',
  warning:        '#D97706',
  warningBg:      '#FEF9C3',
  info:           '#2563EB',
  infoBg:         '#DBEAFE',

  // Dark Mode
  dark: {
    background:   '#111827',
    surface:      '#1F2937',
    border:       '#374151',
    text:         '#F9FAFB',
    textMuted:    '#9CA3AF',
  },
} as const;

export const radii = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  full: 999,
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
} as const;

export const typography = {
  fontFamily: undefined, // System-Font (Inter ist auf iOS/Android nicht eingebettet)
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    xxl:  24,
    hero: 28,
  },
  weights: {
    regular: '400' as const,
    medium:  '500' as const,
    semibold:'600' as const,
    bold:    '700' as const,
  },
} as const;
