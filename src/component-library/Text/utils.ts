import { theme } from '../theme';
import { TextColor } from './types';

const resolveTextColor = (color: TextColor | undefined): string => {
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
