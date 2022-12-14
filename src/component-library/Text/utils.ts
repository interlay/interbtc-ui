import { theme } from '../theme';
import { Colors, Sizes } from '../utils/prop-types';
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

const resolveSize = (size: Sizes | undefined): string => {
  switch (size) {
    case 'xs':
      return theme.text.xs;
    case 's':
      return theme.text.s;
    case 'base':
      return theme.text.base;
    case 'lg':
      return theme.text.lg;
    case 'xl':
      return theme.text.xl;
    case '2xl':
      return theme.text.xl2;
    case '3xl':
      return theme.text.xl3;
    case '4xl':
      return theme.text.xl4;
    case '5xl':
      return theme.text.xl5;
    case '6xl':
      return theme.text.xl6;
    default:
      return theme.text.base;
  }
};

// TODO: fix our line-height set in the theme
const resolveHeight = (size: Sizes | undefined): string | undefined => {
  switch (size) {
    case 's':
      return theme.lineHeight.s;
    case 'base':
    case 'lg':
    case 'xl':
    default:
      return theme.lineHeight.base;
    case 'xs':
    case '2xl':
    case '3xl':
    case '4xl':
    case '5xl':
    case '6xl':
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

export { mapTextProps, resolveHeight, resolveSize, resolveTextColor };
