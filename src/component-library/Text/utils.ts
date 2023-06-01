import { StyledTextProps } from './style';
import { TextProps } from './types';

const mapTextProps = <T extends TextProps = TextProps>({
  color,
  size,
  align,
  weight,
  rows,
  ...props
}: T): Omit<T, 'color' | 'size' | 'align' | 'weight' | 'rows'> & StyledTextProps => ({
  ...props,
  $color: color,
  $size: size,
  $weight: weight,
  $align: align,
  $rows: rows
});

export { mapTextProps };
