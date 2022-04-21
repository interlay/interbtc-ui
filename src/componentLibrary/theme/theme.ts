const theme = {
  colors: {
    ctaPrimary: 'var(--colors-cta-primary)',
    ctaSecondary: `var(--colors-cta-secondary)`,
    textPrimary: 'var(--colors-text-primary)'
  },
  font: {
    primary: `var(--fonts-primary)`
  },
  fontWeight: {
    light: `var(--font-weights-light)`,
    book: `var(--font-weights-book)`,
    medium: `var(--font-weights-medium)`,
    bold: `var(--font-weights-bold)`
  },
  text: {
    xs: `var(--text-xs)`,
    s: `var(--text-s)`,
    base: `var(--text-base)`,
    lg: `var(--text-lg)`,
    xl: `var(--text-xl)`,
    xl2: `var(--text-2xl)`,
    xl3: `var(--text-3xl)`,
    xl4: `var(--text-4xl)`,
    xl5: `var(--text-5xl)`,
    xl6: `var(--text-6xl)`
  },
  lineHeight: {
    base: `var(--line-height-base)`
  },
  spacing: {
    spacing1: 'var(--spacing-1)',
    spacing2: 'var(--spacing-2)',
    spacing3: 'var(--spacing-3)',
    spacing4: 'var(--spacing-4)',
    spacing5: 'var(--spacing-5)',
    spacing6: 'var(--spacing-6)'
  },
  rounded:
    {
      sm: 'var(--rounded-sm)',
      rg: 'var(--rounded-rg)',
      md: 'var(--rounded-md)',
      lg: 'var(--rounded-lg)',
      xl: 'var(--rounded-xl)'
    }
};

type ComponentLibraryTheme = typeof theme;

export { theme };
export type { ComponentLibraryTheme };
