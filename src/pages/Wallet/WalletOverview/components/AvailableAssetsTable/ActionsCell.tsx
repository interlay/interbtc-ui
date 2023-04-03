import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showBuyModal } from '@/common/actions/general.actions';
import { CTA, CTALink, CTALinkProps, CTAProps, Divider, Flex, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { GOVERNANCE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

const queryString = require('query-string');

type SwapCTALinkProps = {
  currency: CurrencyExt;
} & CTALinkProps;

const SwapCTALink = ({ currency, ...props }: SwapCTALinkProps) => {
  const toTicker = isCurrencyEqual(WRAPPED_TOKEN, currency) ? undefined : WRAPPED_TOKEN.ticker;

  const to = {
    pathname: PAGES.SWAP,
    search: queryString.stringify({
      [QUERY_PARAMETERS.SWAP.FROM]: currency.ticker,
      [QUERY_PARAMETERS.SWAP.TO]: toTicker
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
  const dispatch = useDispatch();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isWrappedToken = isCurrencyEqual(currency, WRAPPED_TOKEN);
  const isRedeemable = isWrappedToken && !balance.isZero();
  const isPooledAsset = pooledTickers?.has(currency.ticker);
  const isGovernanceToken = isCurrencyEqual(currency, GOVERNANCE_TOKEN);

  const hasActions = isRedeemable || isPooledAsset || isGovernanceToken;

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
        {isWrappedToken && (
          <CTALink
            {...commonCTAProps}
            to={{
              pathname: PAGES.BRIDGE,
              search: queryString.stringify({
                [QUERY_PARAMETERS.TAB]: 'issue'
              })
            }}
          >
            {t('issue')}
          </CTALink>
        )}
        {isRedeemable && (
          <CTALink
            {...commonCTAProps}
            to={{
              pathname: PAGES.BRIDGE,
              search: queryString.stringify({
                [QUERY_PARAMETERS.TAB]: 'redeem'
              })
            }}
          >
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
        {isGovernanceToken && (
          <CTA {...commonCTAProps} onPress={() => dispatch(showBuyModal(true))}>
            Buy
          </CTA>
        )}
      </Flex>
    </Flex>
  );
};

export { ActionsCell };
export type { ActionsCellProps };
