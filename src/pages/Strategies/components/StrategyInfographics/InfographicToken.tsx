import { HTMLAttributes } from 'react';

import { CoinIcon } from '@/component-library';

import { StyledStack, StyledToken } from './BaseInfographics.styles';

type Props = {
  ticker: string | string[];
};

type InheritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InfographicsPropsToken = Props & InheritAttrs;

const InfographicsToken = ({ ticker, ...props }: InfographicsPropsToken): JSX.Element => {
  if (typeof ticker === 'string') {
    return (
      <StyledToken {...props}>
        <CoinIcon size='xl2' ticker={ticker} />
      </StyledToken>
    );
  }

  return (
    <StyledStack>
      {ticker.map((item) => (
        <StyledToken key={item}>
          <CoinIcon size='xl2' ticker={item} />
        </StyledToken>
      ))}
    </StyledStack>
  );
};

export { InfographicsToken };
export type { InfographicsPropsToken };
