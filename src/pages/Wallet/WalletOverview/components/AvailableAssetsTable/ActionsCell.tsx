import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';

import { CTALink, CTALinkProps, Divider, Flex, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/use-media-query';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

const queryString = require('query-string');

const SwapCTALink = ({
  currency,
  ...props
}: {
  currency: CurrencyExt;
} & CTALinkProps) => {
  const to = {
    pathname: PAGES.SWAP,
    search: queryString.stringify({
      [QUERY_PARAMETERS.SWAP.FROM]: currency.ticker,
      [QUERY_PARAMETERS.SWAP.TO]: WRAPPED_TOKEN.ticker
    })
  };

  return (
    <CTALink {...props} to={to}>
      Swap
    </CTALink>
  );
};

type ActionsCellProps = {
  currency: CurrencyExt;
  pooledTickers?: Set<string>;
};

const ActionsCell = ({ currency, pooledTickers }: ActionsCellProps): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Flex direction='column' gap='spacing4' marginTop={isMobile ? 'spacing4' : undefined}>
      {isMobile && <Divider color='default' />}
      <Flex justifyContent={isMobile ? undefined : 'flex-end'} gap='spacing1'>
        {isCurrencyEqual(currency, WRAPPED_TOKEN) && (
          <CTALink
            fullWidth={isMobile}
            to={{ pathname: PAGES.BRIDGE, search: 'tab=redeem' }}
            variant='outlined'
            size='small'
          >
            Redeem
          </CTALink>
        )}
        <CTALink
          fullWidth={isMobile}
          to={PAGES.TRANSFER}
          variant='outlined'
          size={isMobile && !isSmallMobile ? 'medium' : 'small'}
        >
          Transfer
        </CTALink>
        {pooledTickers?.has(currency.ticker) && (
          <SwapCTALink
            fullWidth={isMobile}
            to={PAGES.SWAP}
            variant='outlined'
            size={isMobile && !isSmallMobile ? 'medium' : 'small'}
            currency={currency}
          />
        )}
        {/* Missing the buy link */}
        <CTALink fullWidth={isMobile} to='' variant='outlined' size={isMobile && !isSmallMobile ? 'medium' : 'small'}>
          Buy
        </CTALink>
      </Flex>
    </Flex>
  );
};

export { ActionsCell };
export type { ActionsCellProps };
