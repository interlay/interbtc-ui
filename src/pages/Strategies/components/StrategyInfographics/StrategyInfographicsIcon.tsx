import { ArrowPathRoundedSquare, PresentationChartBar } from '@/assets/icons';
import { IconProps } from '@/component-library/Icon';

import { StyledIcon } from './StrategyInfographics.styles';

const icons = ['presentation', 'swap'] as const;

type VariantIcons = typeof icons[number];

const mapIcons: Record<VariantIcons, typeof ArrowPathRoundedSquare> = {
  presentation: PresentationChartBar,
  swap: ArrowPathRoundedSquare
};

type Props = {
  variant: VariantIcons;
};

type InheritAttrs = Omit<IconProps, keyof Props>;

type StrategyInfographicsIconProps = Props & InheritAttrs;

const StrategyInfographicsIcon = ({ variant, size, ...props }: StrategyInfographicsIconProps): JSX.Element => {
  const Icon = mapIcons[variant];

  return (
    <StyledIcon $size={size}>
      <Icon size={size} {...props} />
    </StyledIcon>
  );
};

export { StrategyInfographicsIcon };
export type { VariantIcons };
