import { StyledTextProps } from './style';
import { TextProps } from './types';

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

export { mapTextProps };
