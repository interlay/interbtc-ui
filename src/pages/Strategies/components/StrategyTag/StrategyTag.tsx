import { ReactNode } from 'react';

import { SpanProps, TextProps } from '@/component-library/Text';

import { StrategyRisk } from '../../types';
import { StyledTag } from './StrategyTag.style';

const content: Record<StrategyRisk, { color: string; label: string }> = {
  [StrategyRisk.LOW]: {
    color: 'success',
    label: 'Low Risk'
  },
  [StrategyRisk.MEDIUM]: {
    color: 'warning',
    label: 'Medium Risk'
  },
  [StrategyRisk.MEDIUM_HIGH]: {
    color: 'warning',
    label: 'Medium to High Risk'
  },
  [StrategyRisk.HIGH]: {
    color: 'error',
    label: 'High Risk'
  }
};

const getContent = (risk: StrategyRisk) => content[risk];

type Props = {
  risk?: StrategyRisk;
  children?: ReactNode;
};

type InheritAttrs = Omit<SpanProps, keyof Props>;

type StrategyTagProps = Props & InheritAttrs;

const StrategyTag = ({ risk, children, ...props }: StrategyTagProps): JSX.Element => {
  const { color, label } = risk ? getContent(risk) : { label: children, color: undefined };

  return (
    <StyledTag color={color as TextProps['color']} size='xs' {...props}>
      {label}
    </StyledTag>
  );
};

export { StrategyTag };
export type { StrategyTagProps };
