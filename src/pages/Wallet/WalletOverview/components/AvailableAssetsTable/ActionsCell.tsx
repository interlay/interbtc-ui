import { CurrencyExt } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { showBuyModal } from '@/common/actions/general.actions';
import { CTA, CTALink, CTAProps, Divider, Flex, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { usePageQueryParams } from '@/hooks/use-page-query-params';
import { PAGES, QUERY_PARAMETERS, QUERY_PARAMETERS_VALUES } from '@/utils/constants/links';

type ActionsCellProps = {
  currency: CurrencyExt;
  isWrappedToken: boolean;
  isRedeemable: boolean;
  isPooledAsset: boolean;
  isGovernanceToken: boolean;
  isVestingClaimable: boolean;
};

const ActionsCell = ({
  currency,
  isGovernanceToken,
  isPooledAsset,
  isRedeemable,
  isVestingClaimable,
  isWrappedToken
}: ActionsCellProps): JSX.Element | null => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { getLinkProps } = usePageQueryParams();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const vestingClaimTransaction = useTransaction(Transaction.VESTING_CLAIM);

  const handlePressClaimVesting = () => vestingClaimTransaction.execute();

  const handlePressBuyGovernance = () => dispatch(showBuyModal(true));

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
            {...mergeProps(
              commonCTAProps,
              getLinkProps(PAGES.BTC, {
                [QUERY_PARAMETERS.TAB]: QUERY_PARAMETERS_VALUES.BRIDGE.TAB.ISSUE
              })
            )}
          >
            {t('issue')}
          </CTALink>
        )}
        {isRedeemable && (
          <CTALink
            {...mergeProps(
              commonCTAProps,
              getLinkProps(PAGES.BTC, {
                [QUERY_PARAMETERS.TAB]: QUERY_PARAMETERS_VALUES.BRIDGE.TAB.REDEEM
              })
            )}
          >
            {t('redeem')}
          </CTALink>
        )}
        {isPooledAsset && (
          <CTALink
            {...mergeProps(
              commonCTAProps,
              getLinkProps(PAGES.SWAP, {
                [QUERY_PARAMETERS.SWAP.FROM]: currency.ticker,
                [QUERY_PARAMETERS.SWAP.TO]: isWrappedToken ? undefined : WRAPPED_TOKEN.ticker
              })
            )}
          >
            {t('amm.swap')}
          </CTALink>
        )}
        {isGovernanceToken && (
          <>
            <CTA {...commonCTAProps} onPress={handlePressBuyGovernance}>
              Buy
            </CTA>
            {isVestingClaimable && (
              <CTA {...commonCTAProps} onPress={handlePressClaimVesting}>
                Claim vesting
              </CTA>
            )}
          </>
        )}
        {!isWrappedToken && (
          <CTALink
            {...mergeProps(
              commonCTAProps,
              getLinkProps(PAGES.SEND_AND_RECEIVE, {
                [QUERY_PARAMETERS.TAB]: QUERY_PARAMETERS_VALUES.TRANSFER.TAB.BRIDGE
              })
            )}
          >
            Bridge
          </CTALink>
        )}
      </Flex>
    </Flex>
  );
};

export { ActionsCell };
export type { ActionsCellProps };
