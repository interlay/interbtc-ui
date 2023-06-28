import { breakpoints } from '../utils/breakpoints';

const theme = {
  // Layout
  layout: {
    // Note: media queries can't be used with CSS variables
    // TODO: this is a placeholder - will review BPs with UX
    breakpoints: {
      lg: '48em'
    }
  },
  breakpoints,
  // Generic
  colors: {
    textPrimary: 'var(--colors-text-primary)',
    textSecondary: 'var(--colors-text-secondary)',
    textTertiary: 'var(--colors-text-tertiary)',
    bgPrimary: 'var(--colors-bg-primary)',
    warn: `var(--colors-shared-red)`,
    error: 'var(--colors-error)',
    warning: 'var(--colors-warning)',
    success: 'var(--colors-success-darker)'
  },
  font: {
    primary: 'var(--fonts-primary)'
  },
  fontWeight: {
    light: 'var(--font-weights-light)',
    book: 'var(--font-weights-book)',
    medium: 'var(--font-weights-medium)',
    semibold: 'var(--font-weights-semibold)',
    bold: 'var(--font-weights-bold)',
    extrabold: 'var(--font-weights-extrabold)'
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
    spacing0: 'var(--spacing-0)',
    spacing1: 'var(--spacing-1)',
    spacing2: 'var(--spacing-2)',
    spacing3: 'var(--spacing-3)',
    spacing4: 'var(--spacing-4)',
    spacing5: 'var(--spacing-5)',
    spacing6: 'var(--spacing-6)',
    spacing8: 'var(--spacing-8)',
    spacing10: 'var(--spacing-10)',
    spacing12: 'var(--spacing-12)',
    spacing14: 'var(--spacing-14)',
    spacing16: 'var(--spacing-16)',
    spacing18: 'var(--spacing-18)',
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
  // TODO: clean this in each theme
  border: {
    default: '1px solid var(--colors-border)',
    hover: '1px solid var(--colors-input-hover-border)',
    focus: '1px solid var(--colors-input-focus-border)',
    disabled: '1px solid var(--colors-input-disabled-border)',
    error: '1px solid var(--colors-error-dark)'
  },
  outline: {
    default: '2px solid var(--colors-border)'
  },
  boxShadow: {
    default: 'var(--box-shadow-default)',
    focus: '0 0 0 1px var(--colors-input-focus-border)'
  },
  // Components
  input: {
    color: 'var(--colors-input-text)',
    background: 'var(--colors-input-background)',
    height: '4rem',
    default: {
      border: '1px solid var(--colors-input-default-border)'
    },
    hover: {
      border: '1px solid var(--colors-input-hover-border)'
    },
    focus: {
      border: '1px solid var(--colors-input-focus-border)',
      boxShadow: '0 0 0 1px var(--colors-input-focus-border)'
    },
    error: {
      color: 'var(--colors-error-dark)',
      border: '1px solid var(--colors-error-dark)'
    },
    disabled: {
      color: 'var(--colors-input-disabled-text)',
      bg: 'var(--colors-input-disabled-bg)',
      border: '1px solid var(--colors-input-disabled-border)'
    },
    helperText: {
      error: {
        color: 'var(--colors-error-dark)'
      }
    },
    small: {
      text: 'var(--text-s)',
      maxHeight: 'var(--spacing-8)',
      weight: 'var(--font-weights-book)'
    },
    medium: {
      text: 'var(--text-base)',
      maxHeight: 'var(--spacing-10)',
      weight: 'var(--font-weights-book)'
    },
    large: {
      text: 'var(--text-4xl)',
      maxHeight: 'var(--spacing-16)',
      weight: 'var(--font-weights-medium)'
    },
    overflow: {
      large: {
        text: 'var(--text-2xl)'
      }
    },
    paddingX: {
      s: '2rem',
      md: '4rem',
      lg: '6.25rem',
      xl: '8rem',
      xl2: '9.5rem'
    }
  },
  label: {
    text: 'var(--colors-label-text)'
  },
  tokenInput: {
    endAdornment: {
      bg: 'var(--colors-token-input-end-adornment-bg)'
    },
    list: {
      item: {
        default: {
          text: 'var(--colors-token-list-item-text)'
        },
        selected: {
          text: 'var(--colors-token-list-item-select-text)'
        }
      }
    }
  },
  card: {
    outlined: {
      border: '1px solid transparent'
    },
    bg: {
      primary: 'var(--color-card-primary-bg)',
      secondary: 'var(--color-card-secondary-bg)',
      tertiary: 'var(--color-card-tertiary-bg)'
    }
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
    },
    text: {
      text: 'var(--colors-cta-text-text)',
      bgHover: 'var(--colors-cta-text-hover)'
    },
    'x-small': {
      padding: 'var(--spacing-1)',
      text: 'var(--text-xs)',
      // TODO: revist on redesign
      lineHeight: '1'
    },
    small: {
      padding: 'var(--spacing-2)',
      text: 'var(--text-xs)',
      lineHeight: 'var(--line-height-s)'
    },
    medium: {
      padding: 'var(--spacing-3) var(--spacing-10)',
      text: 'var(--text-base)',
      lineHeight: 'var(--line-height-base)'
    },
    large: {
      padding: 'var(--spacing-4) var(--spacing-12)',
      text: 'var(--text-lg)',
      lineHeight: 'var(--line-height-lg)'
    }
  },
  table: {
    border: '1px solid var(--colors-table-border)',
    header: {
      bg: 'var(--color-table-header-row-bg)'
    },
    row: {
      odd: {
        bg: 'var(--colors-table-odd-row-bg)'
      },
      even: {
        bg: 'var(--colors-table-even-row-bg)'
      },
      bgHover: 'var(--colors-table-row-hover-bg)'
    }
  },
  alert: {
    status: {
      error: 'var(--colors-error)',
      warning: 'var(--colors-warning)',
      success: 'var(--colors-success-darker)'
    },
    bg: {
      error: 'var(--colors-error-20)',
      warning: 'var(--colors-warning-light-20)',
      success: 'var(--colors-success-20)'
    }
  },
  transition: {
    default: 'var(--transitions-default)',
    duration: {
      duration100: 100,
      duration150: 150,
      duration250: 250
    }
  },
  tabs: {
    bg: 'var(--colors-tabs-bg)',
    color: 'var(--colors-tabs-text)',
    active: {
      color: 'var(--colors-tabs-active-color)',
      bg: 'var(--colors-tabs-active-bg)'
    },
    border: '1px solid var(--colors-border)',
    small: {
      wrapper: {
        padding: 'var(--spacing-1) var(--spacing-2)'
      },
      tab: {
        padding: 'var(--spacing-1) var(--spacing-4)',
        text: 'var(--text-xs)',
        fontWeight: 'var(--font-weights-book)'
      },
      selection: {
        padding: 'var(--spacing-1)'
      }
    },
    medium: {
      wrapper: {
        padding: 'var(--spacing-1) var(--spacing-2)'
      },
      tab: {
        padding: 'var(--spacing-2) var(--spacing-6)',
        text: 'var(--text-s)',
        fontWeight: 'var(--font-weights-book)'
      },
      selection: {
        padding: 'var(--spacing-1)'
      }
    },
    large: {
      wrapper: {
        padding: 'var(--spacing-2) var(--spacing-3)'
      },
      tab: {
        padding: 'var(--spacing-3) var(--spacing-8)',
        text: 'var(--text-base)',
        fontWeight: 'var(--font-weights-medium)'
      },
      selection: {
        padding: 'var(--spacing-2)'
      }
    }
  },
  meter: {
    bar: {
      status: {
        error: 'var(--colors-meter-bar-error-color)',
        warning: 'var(--colors-meter-bar-warning-color)',
        success: 'var(--colors-meter-bar-success-color)'
      },
      primary: {
        bg: `linear-gradient(270deg, 
          var(--colors-meter-bar-success-color) 0%, 
          var(--colors-meter-bar-warning-color) 50%, 
          var(--colors-meter-bar-error-color) 100%)`
      },
      secondary: {
        bg: 'var(--colors-neutral-lighter-grey)'
      },
      height: '10px',
      radius: 'var(--rounded-full)',
      indicator: {
        border: {
          left: '8px solid transparent',
          right: '8px solid transparent',
          bottom: '8px solid var(--colors-meter-bar-indicator-color)'
        },
        color: 'var(--colors-meter-bar-indicator-color)',
        primary: {
          marginTop: '12px'
        },
        secondary: {
          marginTop: '4px'
        }
      },
      separator: {
        color: 'var(--colors-meter-bar-separator-color)'
      }
    }
  },
  progressBar: {
    bg: 'var(--colors-border)'
  },
  spinner: {
    determinate: {
      color: 'var(--colors-cta-primary)',
      bg: 'var(--colors-cta-secondary)'
    },
    indeterminate: {
      primary: {
        color: 'var(--colors-indeterminate-primary-color)',
        bg: 'var(--colors-indeterminate-primary-bg)'
      },
      secondary: {
        color: 'var(--colors-indeterminate-secondary-color)',
        bg: 'var(--colors-indeterminate-secondary-bg)'
      },
      outlined: {
        color: 'var(--colors-indeterminate-outlined-color)',
        bg: 'var(--colors-indeterminate-outlined-bg)'
      },
      text: {
        color: 'var(--colors-indeterminate-outlined-color)',
        bg: 'var(--colors-indeterminate-outlined-bg)'
      }
    }
  },
  progress: {
    circle: {
      mask: 'var(--color-progress-circle-mask)',
      fill: 'var(--color-progress-circle-fill)'
    }
  },
  overlay: {
    placement: {
      transform: '6px'
    },
    bg: 'var(--colors-neutral-black-30)'
  },
  transaction: {
    status: {
      color: {
        error: 'var(--colors-error)',
        warning: 'var(--colors-warning-light)',
        success: 'var(--colors-success)'
      },
      bg: {
        error: 'var(--colors-error-20)',
        warning: 'var(--colors-warning-light-20)',
        success: 'var(--colors-success-20)'
      }
    }
  },
  coinIcon: {
    small: {
      width: '2.625rem'
    },
    medium: {
      width: '3.755rem'
    },
    large: {
      width: '5.625rem'
    }
  },
  dialog: {
    small: {
      width: '400px',
      header: {
        paddingTop: 'var(--spacing-4)',
        paddingBottom: 'var(--spacing-2)',
        paddingX: 'var(--spacing-4)',
        padding: 'var(--spacing-4) var(--spacing-8) var(--spacing-2) var(--spacing-4)'
      },
      divider: {
        marginX: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-1)'
      },
      body: {
        paddingY: 'var(--spacing-2)',
        paddingX: 'var(--spacing-4)'
      },
      footer: {
        paddingTop: 'var(--spacing-1)',
        paddingBottom: 'var(--spacing-4)',
        paddingX: 'var(--spacing-4)',
        padding: 'var(--spacing-1) var(--spacing-4) var(--spacing-4)'
      }
    },
    medium: {
      width: '32rem',
      header: {
        paddingY: 'var(--spacing-4)',
        paddingX: 'var(--spacing-6)',
        padding: 'var(--spacing-4) var(--spacing-8) var(--spacing-4) var(--spacing-6)'
      },
      divider: {
        marginX: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-2)'
      },
      body: {
        paddingY: 'var(--spacing-6)',
        paddingX: 'var(--spacing-6)'
      },
      footer: {
        paddingTop: 'var(--spacing-4)',
        paddingBottom: 'var(--spacing-6)',
        paddingX: 'var(--spacing-6)',
        padding: 'var(--spacing-4) var(--spacing-6) var(--spacing-6)'
      }
    },
    large: {
      width: '32rem',
      header: {
        paddingY: 'var(--spacing-4)',
        paddingX: 'var(--spacing-6)',
        padding: 'var(--spacing-4) var(--spacing-8) var(--spacing-4) var(--spacing-6)'
      },
      divider: {
        marginX: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-2)'
      },
      body: {
        paddingY: 'var(--spacing-3)',
        paddingX: 'var(--spacing-6)'
      },
      footer: {
        paddingTop: 'var(--spacing-4)',
        paddingBottom: 'var(--spacing-6)',
        paddingX: 'var(--spacing-6)',
        padding: 'var(--spacing-4) var(--spacing-6) var(--spacing-6)'
      }
    },
    closeBtn: {
      zIndex: 100
    }
  },
  modal: {
    maxHeight: 'calc(100vh - var(--spacing-12))',
    // TODO: z-index needs to be higher
    zIndex: 2,
    underlay: {
      zIndex: 1,
      bg: 'var(--colors-neutral-black-60)',
      transition: {
        entering: 'opacity .15s cubic-bezier(0,0,.4,1)',
        exiting: 'opacity .1s cubic-bezier(0.5,0,1,1), visibility 0s linear .1s'
      }
    },
    transition: {
      entering: 'transform .15s cubic-bezier(0,0,0.4,1) .1s, opacity .15s cubic-bezier(0,0,0.4,1)',
      exiting: 'opacity .1s cubic-bezier(0.5,0,1,1), visibility 0s linear, transform 0s linear .1s'
    }
  },
  switch: {
    unchecked: {
      bg: 'var(--colors-switch-unchecked-bg)'
    },
    checked: {
      bg: 'var(--colors-switch-checked-bg)'
    },
    indicator: {
      bg: 'var(--colors-switch-indicator-bg)'
    }
  },
  tooltip: {
    bg: 'var(--colors-tooltip-bg)',
    offset: '3px',
    tip: {
      bg: 'var(--colors-tooltip-tip-bg)',
      width: '5px'
    }
  },
  divider: {
    bg: 'var(--colors-border)',
    size: {
      small: '1px',
      medium: '2px',
      large: '3px'
    }
  },
  icon: {
    sizes: {
      s: 'var(--spacing-4)',
      md: 'var(--spacing-6)',
      lg: 'var(--spacing-8)',
      xl: 'var(--spacing-10)',
      xl2: 'var(--spacing-12)'
    },
    fallback: {
      color: 'var(--color-icon-fallback-color)',
      stroke: 'var(--color-icon-fallback-stroke)'
    }
  },
  list: {
    text: 'var(--color-list-selected-text)',
    primary: {
      bg: '',
      border: '',
      rounded: ''
    },
    secondary: {
      bg: '',
      border: '',
      rounded: ''
    },
    card: {
      bg: 'var(--colors-table-odd-row-bg)',
      border: '1px solid var(--colors-border)',
      rounded: 'var(--rounded-md)'
    },
    item: {
      primary: {
        bg: 'var(--color-list-primary-bg)',
        border: '1px solid var(--colors-border)',
        hover: {
          bg: 'var(--color-list-primary-hover-bg)'
        },
        rounded: 'var(--rounded-md)'
      },
      secondary: {
        bg: 'var(--color-list-secondary-bg)',
        border: 'none',
        hover: {
          bg: 'var(--color-list-secondary-hover-bg)'
        },
        rounded: 'var(--rounded-md)'
      },
      card: {
        bg: 'var(--colors-table-odd-row-bg)',
        border: '1px solid var(--colors-border)',
        hover: {
          bg: 'var(--color-list-primary-hover-bg)'
        },
        rounded: ''
      }
    }
  },
  select: {
    placeholder: 'var(--colors-text-tertiary)',
    color: 'var(--color-select-text)',
    size: {
      small: {
        padding: 'var(--spacing-1) var(--spacing-2)',
        text: 'var(--text-xs)',
        // TODO: to be determined
        maxHeight: 'calc(var(--spacing-6) - 1px)'
      },
      medium: {
        padding: 'var(--spacing-2)',
        text: 'var(--text-base)',
        maxHeight: 'calc(var(--spacing-10) - 1px)'
      },
      large: {
        padding: 'var(--spacing-5) var(--spacing-2)',
        text: 'var(--text-lg)',
        maxHeight: 'calc(var(--spacing-16) - 1px)'
      }
    }
  }
};

type ComponentLibraryTheme = typeof theme;

export { theme };
export type { ComponentLibraryTheme };
