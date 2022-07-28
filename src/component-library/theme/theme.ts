const theme = {
  // Layout
  layout: {
    // Note: media queries can't be used with CSS variables
    // TODO: this is a placeholder - will review BPs with UX
    breakpoints: {
      lg: '48em'
    }
  },
  // Generic
  colors: {
    textPrimary: 'var(--colors-text-primary)',
    textSecondary: 'var(--colors-text-secondary)',
    textTertiary: 'var(--colors-text-tertiary)',
    bgPrimary: 'var(--colors-bg-primary)',
    warn: `var(--colors-shared-red)`
  },
  font: {
    primary: 'var(--fonts-primary)'
  },
  fontWeight: {
    light: 'var(--font-weights-light)',
    book: 'var(--font-weights-book)',
    medium: 'var(--font-weights-medium)',
    bold: 'var(--font-weights-bold)'
  },
  text: {
    xs: 'var(--text-xs)',
    s: 'var(--text-s)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    xl2: 'var(--text-2xl)',
    xl3: 'var(--text-3xl)',
    xl4: 'var(--text-4xl)',
    xl5: 'var(--text-5xl)',
    xl6: 'var(--text-6xl)'
  },
  lineHeight: {
    base: 'var(--line-height-base)',
    s: 'var(--line-height-s)',
    lg: 'var(--line-height-lg)',
    xl: 'var(--line-height-xl)'
  },
  spacing: {
    spacing1: 'var(--spacing-1)',
    spacing2: 'var(--spacing-2)',
    spacing3: 'var(--spacing-3)',
    spacing4: 'var(--spacing-4)',
    spacing5: 'var(--spacing-5)',
    spacing6: 'var(--spacing-6)',
    spacing8: 'var(--spacing-8)',
    spacing10: 'var(--spacing-10)',
    spacing12: 'var(--spacing-12)',
    spacing28: 'var(--spacing-28)'
  },
  rounded: {
    sm: 'var(--rounded-sm)',
    rg: 'var(--rounded-rg)',
    md: 'var(--rounded-md)',
    lg: 'var(--rounded-lg)',
    xl: 'var(--rounded-xl)',
    full: 'var(--rounded-full)'
  },
  border: {
    default: '1px solid var(--colors-border)'
  },
  outline: {
    default: '2px solid var(--colors-border)'
  },
  boxShadow: {
    default: 'var(--box-shadow-default)'
  },
  // Components
  card: {
    bg: 'var(--colors-card-bg)',
    secondaryBg: 'var(--colors-card-secondary-bg)'
  },
  cta: {
    primary: {
      bg: 'var(--colors-cta-primary)',
      bgHover: 'var(--colors-cta-primary-hover)',
      text: 'var(--colors-cta-primary-text)'
    },
    secondary: {
      bg: 'var(--colors-cta-secondary)',
      text: 'var(--colors-cta-secondary-text)'
    },
    outlined: {
      text: 'var(--colors-cta-outlined-text)',
      border: '1px solid var(--colors-cta-outlined-border)',
      bgHover: 'var(--colors-cta-outlined-hover)'
    }
  },
  table: {
    border: '1px var(--colors-neutral-light-grey-50) solid'
  },
  alert: {
    severity: {
      error: 'var(--colors-error)',
      warning: 'var(--colors-warning)',
      success: 'var(--colors-success)'
    }
  },
  transition: {
    duration: 100
  },
  tabs: {
    bg: 'var(--colors-tabs-bg)',
    color: 'var(--colors-tabs-text)',
    active: {
      color: 'var(--colors-tabs-active-color)',
      bg: 'var(--colors-tabs-active-bg)'
    },
    border: '1px solid var(--colors-border)'
  },
  score: {
    bar: {
      radius: 'var(--rounded-full)'
    }
  }
};

type ComponentLibraryTheme = typeof theme;

export { theme };
export type { ComponentLibraryTheme };
