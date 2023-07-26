import { HTMLAttributes, ReactNode } from 'react';

import { StyledArrow, StyledBottomArrow, StyledGrid, StyledLabel } from './BaseInfographics.styles';
import { BaseInfographicsItem } from './BaseInfographicsItem';

type ItemData = {
  icon: ReactNode;
  subIcon?: ReactNode;
  label: ReactNode;
};

type Props = {
  items: ItemData[];
};

type InheritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type BaseInfographicsProps = Props & InheritAttrs;

const BaseInfographics = ({ items, ...props }: BaseInfographicsProps): JSX.Element => {
  const [iconA, iconB, iconC] = items.map((item) => item.icon);
  const [labelA, labelB, labelC] = items.map((item) => item.label);

  return (
    <StyledGrid {...props}>
      <div />
      <BaseInfographicsItem icon={iconA} />
      <StyledArrow $hasArrow />
      <BaseInfographicsItem icon={iconB} />
      <StyledArrow $hasArrow />
      <BaseInfographicsItem icon={iconC} />
      <div />
      <StyledLabel size='xs' align='center'>
        {labelA}
      </StyledLabel>
      <StyledLabel size='xs' align='center'>
        {labelB}
      </StyledLabel>
      <StyledLabel size='xs' align='center'>
        {labelC}
      </StyledLabel>
      <div />
      <StyledBottomArrow />
      <div />
    </StyledGrid>
  );
};

export { BaseInfographics };
export type { BaseInfographicsProps, ItemData };
