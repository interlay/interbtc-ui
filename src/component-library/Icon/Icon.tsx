import { BaseCheckCircleIcon, BaseCheckmarkIcon, BaseChevronRight, BaseCloseIcon } from './Icon.style';

type IconVariant = 'close' | 'checkmark' | 'check-circle' | 'chevron-right';

interface IconProps extends React.ComponentPropsWithRef<'svg'> {
  variant: IconVariant;
}

const Icon = ({ variant, ...rest }: IconProps): JSX.Element => {
  switch (variant) {
    case 'close':
      return <BaseCloseIcon {...rest} />;
    case 'checkmark':
      return <BaseCheckmarkIcon {...rest} />;
    case 'check-circle':
      return <BaseCheckCircleIcon {...rest} />;
    case 'chevron-right':
      return <BaseChevronRight {...rest} />;
    default:
      throw new Error('Something went wrong!');
  }
};

export { Icon };
export type { IconProps, IconVariant };
