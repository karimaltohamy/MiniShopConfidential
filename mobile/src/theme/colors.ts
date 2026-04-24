// HSL to Hex conversion helper
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Legacy light theme colors (for backwards compatibility)
export const colors = {
  // Brand
  primary: {
    50: '#f9f5eb',
    100: '#f0e8db',
    200: '#e4d4bd',
    300: '#d4be95',
    400: '#c4a86d',
    500: '#B69041',
    600: '#9a7a39',
    700: '#7a5c2e',
    800: '#5c4524',
    900: '#403119',
  },

  // Semantic
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Backgrounds
  background: '#ffffff',
  surface: '#f9fafb',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDisabled: '#9ca3af',

  // Dark mode (legacy)
  dark: {
    background: '#111827',
    surface: '#1f2937',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
  },
};

// Full theme definitions
export const lightTheme = {
  mode: 'light' as const,
  colors: {
    // Backgrounds
    background: '#ffffff',
    surface: '#f9fafb',
    surfaceVariant: '#f3f4f6',

    // Text
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textDisabled: '#9ca3af',
    textInverse: '#ffffff',

    // Brand
    primary: {
      50: '#f9f5eb',
      100: '#f0e8db',
      200: '#e4d4bd',
      300: '#d4be95',
      400: '#c4a86d',
      500: '#B69041',
      600: '#9a7a39',
      700: '#7a5c2e',
      800: '#5c4524',
      900: '#403119',
    },
    primaryForeground: '#222222',

    // Semantic
    success: {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },

    // Neutrals
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // UI elements
    card: '#ffffff',
    cardForeground: '#111827',
    popover: '#ffffff',
    popoverForeground: '#111827',
    secondary: '#f3f4f6',
    secondaryForeground: '#111827',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    accent: '#f3f4f6',
    accentForeground: '#111827',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e5e7eb',
    input: '#e5e7eb',
    ring: '#B69041',

    radius: 8,
  },
};

export const darkTheme = {
  mode: 'dark' as const,
  colors: {
    // Backgrounds - converted from provided HSL
    background: hslToHex(222, 30, 8), // --background
    surface: hslToHex(222, 28, 10), // --card
    surfaceVariant: hslToHex(222, 18, 16), // --muted

    // Text
    textPrimary: hslToHex(210, 40, 98), // --foreground
    textSecondary: hslToHex(215, 20, 65), // --muted-foreground
    textDisabled: hslToHex(215, 20, 45),
    textInverse: hslToHex(210, 40, 98),

    // Brand primary - use provided dark primary values
    primary: {
      50: hslToHex(42, 56, 95),
      100: hslToHex(30, 50, 89),
      200: hslToHex(32, 47, 82),
      300: hslToHex(33, 46, 71),
      400: hslToHex(34, 45, 60),
      500: hslToHex(34, 47, 48),
      600: hslToHex(34, 46, 41),
      700: hslToHex(34, 45, 33),
      800: hslToHex(34, 44, 25),
      900: hslToHex(34, 44, 17),
    },
    primaryForeground: hslToHex(222, 30, 10), // --primary-foreground

    // Semantic (keep same)
    success: {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },

    // Neutrals (use gray scale)
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // UI elements - map from provided CSS variables
    card: hslToHex(222, 28, 10), // --card
    cardForeground: hslToHex(210, 40, 98), // --card-foreground
    popover: hslToHex(222, 28, 10), // --popover
    popoverForeground: hslToHex(210, 40, 98), // --popover-foreground
    secondary: hslToHex(220, 30, 10),
    secondaryForeground: hslToHex(210, 40, 98),
    muted: hslToHex(222, 18, 16), // --muted
    mutedForeground: hslToHex(215, 20, 65), // --muted-foreground
    accent: hslToHex(222, 22, 20), // --accent
    accentForeground: hslToHex(210, 40, 98), // --accent-foreground
    destructive: hslToHex(0, 65, 45), // --destructive
    destructiveForeground: hslToHex(210, 40, 98), // --destructive-foreground
    border: hslToHex(222, 18, 22), // --border
    input: hslToHex(222, 18, 20), // --input
    ring: hslToHex(34, 70, 55), // --ring

    radius: 8,
  },
};
