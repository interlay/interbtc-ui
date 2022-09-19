import { theme } from '../theme';
import { Colors } from '../utils/prop-types';

const resolveTextColor = (color: Colors | undefined): string => {
  switch (color) {
    case 'primary':
      return theme.colors.textPrimary;
    case 'secondary':
      return theme.colors.textSecondary;
    case 'tertiary':
      return theme.colors.textTertiary;
    default:
      return theme.colors.textPrimary;
  }
};

export { resolveTextColor };
