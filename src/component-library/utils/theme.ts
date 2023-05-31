import { theme } from '../theme';
import { Colors, FontSize } from './prop-types';

const resolveColor = (color: Colors | undefined): string => {
  switch (color) {
    case 'primary':
      return theme.colors.textPrimary;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'tertiary':
      return theme.colors.textTertiary;
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    default:
      return theme.colors.textPrimary;
  }
};

// TODO: fix our line-height set in the theme
const resolveHeight = (size: FontSize | undefined): string | undefined => {
  switch (size) {
    case 's':
      return theme.lineHeight.s;
    case 'base':
    case 'lg':
    case 'xl':
    default:
      return theme.lineHeight.base;
    case 'xs':
    case 'xl2':
    case 'xl3':
    case 'xl4':
    case 'xl5':
    case 'xl6':
      return undefined;
  }
};

export { resolveColor, resolveHeight };
