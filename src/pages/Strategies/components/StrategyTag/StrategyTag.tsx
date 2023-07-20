import { SpanProps, TextProps } from '@/component-library/Text';
import { StrategyRisk } from '@/types/strategies';

import { StyledTag } from './StrategyTag.style';

const content: Record<StrategyRisk, { color: string; label: string }> = {
  low: {
    color: 'success',
    label: 'Low Risk'
  },
  medium: {
    color: 'warning',
    label: 'Medium Risk'
  },
  high: {
    color: 'error',
    label: 'High Risk'
  }
};

const getContent = (risk: StrategyRisk) => content[risk];

type Props = {
  variant: 'risk' | 'passive-income';
  risk?: StrategyRisk;
};

type InheritAttrs = Omit<SpanProps, keyof Props>;

type StrategyTagProps = Props & InheritAttrs;

const StrategyTag = ({ variant, risk, ...props }: StrategyTagProps): JSX.Element => {
  const { color, label } =
    variant === 'risk' && risk ? getContent(risk) : { label: 'Passive Income', color: undefined };

  return (
    <StyledTag color={color as TextProps['color']} size='xs' {...props}>
      {label}
    </StyledTag>
  );
};

export { StrategyTag };
export type { StrategyTagProps };
