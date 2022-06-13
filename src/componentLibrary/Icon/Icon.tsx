import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
import { IconWrapper } from './Icon.style';

type IconVariant = 'close' | 'checkmark';

interface IconProps {
  variant: IconVariant;
  color?: string;
}

const Icon = ({ variant, color }: IconProps): JSX.Element | null => {
  return (
    <IconWrapper color={color}>
      {
        variant === 'close' ? <CloseIcon /> : 
        variant === 'checkmark' ? <CheckmarkIcon /> : 
        null
      }
    </IconWrapper>
  )
};

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps, IconVariant };
