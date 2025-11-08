// Premium color palette for extra crisp aesthetics
export const Colors = {
  light: {
    primary: '#6366f1',      // Indigo
    secondary: '#8b5cf6',    // Purple
    accent: '#ec4899',       // Pink
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    error: '#ef4444',        // Red
    background: '#ffffff',
    surface: '#f9fafb',
    card: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    placeholder: '#9ca3af',
  },
  dark: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    accent: '#f472b6',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    background: '#0f172a',
    surface: '#1e293b',
    card: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    placeholder: '#64748b',
  },
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    sunset: ['#f59e0b', '#ec4899'],
    ocean: ['#06b6d4', '#3b82f6'],
    forest: ['#10b981', '#059669'],
    fire: ['#ef4444', '#f97316'],
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  tiny: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};




