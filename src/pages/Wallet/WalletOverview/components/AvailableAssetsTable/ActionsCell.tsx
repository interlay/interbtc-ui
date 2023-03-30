import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { CTALink, CTALinkProps, CTAProps, Divider, Flex, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
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

  return <CTALink {...props} to={to} />;
};

type ActionsCellProps = {
  currency: CurrencyExt;
  balance: MonetaryAmount<CurrencyExt>;
  pooledTickers?: Set<string>;
};

const ActionsCell = ({ balance, currency, pooledTickers }: ActionsCellProps): JSX.Element | null => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isRedeemable = isCurrencyEqual(currency, WRAPPED_TOKEN) && !balance.isZero();
  const isPooledAsset = pooledTickers?.has(currency.ticker);
  const isBuyable = isCurrencyEqual(currency, GOVERNANCE_TOKEN);

  const hasActions = isRedeemable || isPooledAsset || isBuyable;

  if (!hasActions) {
    return null;
  }

  const commonCTAProps: CTAProps = {
    fullWidth: isMobile,
    variant: 'outlined',
    size: isMobile && !isSmallMobile ? 'medium' : 'small'
  };

  return (
    <Flex direction='column' gap='spacing4' marginTop={isMobile ? 'spacing4' : undefined}>
      {isMobile && <Divider color='default' />}
      <Flex justifyContent={isMobile ? undefined : 'flex-end'} gap='spacing1'>
        {isRedeemable && (
          <CTALink {...commonCTAProps} to={{ pathname: PAGES.BRIDGE, search: 'tab=redeem' }}>
            {t('redeem')}
          </CTALink>
        )}
        {/* TODO: add when xcm re-vamp is added */}
        {/* <CTALink {...commonCTAProps} to={PAGES.TRANSFER}>
          {t('transfer')}
        </CTALink> */}
        {isPooledAsset && (
          <SwapCTALink {...commonCTAProps} to={PAGES.SWAP} currency={currency}>
            {t('amm.swap')}
          </SwapCTALink>
        )}
        {/* TODO: add when banxa on-ramp is added */}
        {/* {isBuyable && (
          <CTALink {...commonCTAProps} to=''>
            Buy
          </CTALink>
        )} */}
      </Flex>
    </Flex>
  );
};

export { ActionsCell };
export type { ActionsCellProps };
