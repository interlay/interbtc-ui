import { theme } from '../theme';
import { Colors, FontSize } from '../utils/prop-types';
import { StyledTextProps } from './style';
import { TextProps } from './types';

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

const mapTextProps = <T extends TextProps = TextProps>({
  color,
  size,
  align,
  weight,
  ...props
}: T): Omit<T, 'color' | 'size' | 'align' | 'weight'> & StyledTextProps => ({
  ...props,
  $color: color,
  $size: size,
  $weight: weight,
  $align: align
});

export { mapTextProps, resolveHeight, resolveTextColor };
