import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';

import { IconWrapper } from './Icon.style';

type IconVariant = 'close' | 'checkmark';

interface IconProps {
  variant: IconVariant;
}

const Icon = ({ variant }: IconProps): JSX.Element | null => {
  // ray test touch <
  let icon;
  switch (variant) {
    case 'close':
      icon = <CloseIcon />;
      break;
    case 'checkmark':
      icon = <CheckmarkIcon />;
      break;
    default:
      throw new Error('Something went wrong!');
  }
  // ray test touch >

  return <IconWrapper>{icon}</IconWrapper>;
};

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps, IconVariant };
