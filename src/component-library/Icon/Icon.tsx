import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';

import { IconWrapper } from './Icon.style';

type IconVariant = 'close' | 'checkmark';

interface IconProps {
  variant: IconVariant;
}

const Icon = ({ variant }: IconProps): JSX.Element | null => {
  return (
    <IconWrapper>
      {variant === 'close' ? <CloseIcon /> : variant === 'checkmark' ? <CheckmarkIcon /> : null}
    </IconWrapper>
  );
};

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps, IconVariant };
