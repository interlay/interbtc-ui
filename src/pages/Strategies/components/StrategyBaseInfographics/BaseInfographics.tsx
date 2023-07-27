import { HTMLAttributes, ReactNode } from 'react';

import {
  StyledBaseInfographicsItem,
  StyledEndArrow,
  StyledGrid,
  StyledLabel,
  StyledRightArrow
} from './BaseInfographics.styles';
import { VariantIcons } from './BaseInfographicsIcon';

type ItemData = {
  icon?: VariantIcons;
  ticker?: string | string[];
  subIcon?: VariantIcons;
  label: ReactNode;
};

type Props = {
  items: ItemData[];
  isCyclic?: boolean;
  endCycleLabel?: ReactNode;
};

type InheritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type BaseInfographicsProps = Props & InheritAttrs;

const BaseInfographics = ({ items, isCyclic, endCycleLabel, ...props }: BaseInfographicsProps): JSX.Element => {
  const [itemA, itemB, itemC] = items;

  return (
    <StyledGrid $isCyclic={isCyclic} {...props}>
      <StyledBaseInfographicsItem
        $gridArea='start-icon'
        icon={itemA.icon}
        ticker={itemA.ticker}
        subIcon={itemA.subIcon}
      />
      <StyledRightArrow $gridArea='first-right-arrow' />
      <StyledBaseInfographicsItem
        $gridArea='middle-icon'
        icon={itemB.icon}
        ticker={itemB.ticker}
        subIcon={itemB.subIcon}
      />
      <StyledRightArrow $gridArea='second-right-arrow' />
      <StyledBaseInfographicsItem
        $gridArea='end-icon'
        icon={itemC.icon}
        ticker={itemC.ticker}
        subIcon={itemC.subIcon}
      />
      <StyledLabel $gridArea='start-label' size='xs' align='center'>
        {itemA.label}
      </StyledLabel>
      <StyledLabel $gridArea='middle-label' size='xs' align='center'>
        {itemB.label}
      </StyledLabel>
      <StyledLabel $gridArea='end-label' size='xs' align='center'>
        {itemC.label}
      </StyledLabel>
      {isCyclic && (
        <>
          <StyledEndArrow />
          <StyledLabel $gridArea='cycle-label' size='xs' align='center'>
            {endCycleLabel}
          </StyledLabel>
        </>
      )}
    </StyledGrid>
  );
};

export { BaseInfographics };
export type { BaseInfographicsProps, ItemData };
