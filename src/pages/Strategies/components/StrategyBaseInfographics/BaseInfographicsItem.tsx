import { FlexProps, theme, useMediaQuery } from '@/component-library';

import { StyledItemContainer, StyledSubIcon } from './BaseInfographics.styles';
import { BaseInfographicsIcon, VariantIcons } from './BaseInfographicsIcon';
import { BaseInfographicsToken } from './BaseInfographicToken';

type Props = {
  icon?: VariantIcons;
  ticker?: string | string[];
  subIcon?: VariantIcons;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type BaseInfographicsItemProps = Props & InheritAttrs;

const BaseInfographicsItem = ({ icon, ticker, subIcon, ...props }: BaseInfographicsItemProps): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledItemContainer alignItems='center' direction='column' gap='spacing2' {...props}>
      {ticker && <BaseInfographicsToken ticker={ticker} size={isMobile ? 'xl' : 'xl2'} />}
      {icon && <BaseInfographicsIcon size='md' variant={icon} />}
      {subIcon && (
        <StyledSubIcon $isCenterPosition={Array.isArray(ticker)}>
          {<BaseInfographicsIcon variant={subIcon} size='s' />}
        </StyledSubIcon>
      )}
    </StyledItemContainer>
  );
};

export { BaseInfographicsItem };
