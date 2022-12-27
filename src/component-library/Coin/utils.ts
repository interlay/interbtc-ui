import { StyledIconProps } from './style';
import { IconProps } from './types';

const mapIconProps = <T extends IconProps = IconProps>({ size, ...props }: T): Omit<T, 'size'> & StyledIconProps => ({
  ...props,
  $size: size
});

export { mapIconProps };
