import { BaseCloseIcon, BaseCheckmarkIcon } from './Icon.style';

type IconVariant = 'close' | 'checkmark';

interface IconProps {
  variant: IconVariant;
}

const Icon = ({ variant }: IconProps): JSX.Element => {
  switch (variant) {
    case 'close':
      return <BaseCloseIcon />;
    case 'checkmark':
      return <BaseCheckmarkIcon />;
    default:
      throw new Error('Something went wrong!');
  }
};

export { Icon };
export type { IconProps, IconVariant };
