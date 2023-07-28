import { FlexProps, theme, useMediaQuery } from '@/component-library';

import { StrategyInfographicsToken } from './StrategtInfographicToken';
import { StyledItemContainer, StyledSubIcon } from './StrategyInfographics.styles';
import { StrategyInfographicsIcon, VariantIcons } from './StrategyInfographicsIcon';

type Props = {
  icon?: VariantIcons;
  ticker?: string | string[];
  subIcon?: VariantIcons;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StrategyInfographicsItemProps = Props & InheritAttrs;

const StrategyInfographicsItem = ({ icon, ticker, subIcon, ...props }: StrategyInfographicsItemProps): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledItemContainer alignItems='center' direction='column' gap='spacing2' {...props}>
      {ticker && <StrategyInfographicsToken ticker={ticker} size={isMobile ? 'xl' : 'xl2'} />}
      {icon && <StrategyInfographicsIcon size='md' variant={icon} />}
      {subIcon && (
        <StyledSubIcon $isCenterPosition={Array.isArray(ticker)}>
          {<StrategyInfographicsIcon variant={subIcon} size='s' />}
        </StyledSubIcon>
      )}
    </StyledItemContainer>
  );
};

export { StrategyInfographicsItem };
