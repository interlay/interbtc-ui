import { ReactComponent as CloseIcon } from '@material-icons/svg/svg/close/baseline.svg';
import { ReactComponent as CheckmarkIcon } from '@material-icons/svg/svg/check/baseline.svg';
import { SVGProps } from 'react';

type IconVariant = 'close' | 'checkmark';

interface IconProps extends SVGProps<SVGSVGElement> {
  variant: IconVariant;
}

const Icon = ({ variant, ...props }: IconProps): JSX.Element | null => {
  const IconVariant = (() => {
    switch (variant) {
      case 'close':
        return CloseIcon;
      case 'checkmark':
        return CheckmarkIcon;
    }
  })();
  return <IconVariant {...props} />;
};

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps, IconVariant };
