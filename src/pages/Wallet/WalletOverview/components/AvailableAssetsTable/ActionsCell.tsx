import { CurrencyExt } from '@interlay/interbtc-api';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { showBuyModal } from '@/common/actions/general.actions';
import { CTA, CTALink, CTAProps, Divider, Flex, theme } from '@/component-library';
import { useMediaQuery } from '@/component-library/utils/use-media-query';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES, QUERY_PARAMETERS } from '@/utils/constants/links';

const queryString = require('query-string');

const claimVesting = async () => {
  await window.bridge.api.tx.vesting.claim();
};

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

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClaimVestingSuccess = () => {
    toast.success('Successfully claimed vesting');
  };

  const handleClaimVestingError = (error: Error) => {
    toast.success(error);
  };

  const claimVestingMutation = useMutation<void, Error, void>(claimVesting, {
    onSuccess: handleClaimVestingSuccess,
    onError: handleClaimVestingError
  });

  const handlePressClaimVesting = () => claimVestingMutation.mutate();

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
          <CTALink
            {...commonCTAProps}
            to={{
              pathname: PAGES.SWAP,
              search: queryString.stringify({
                [QUERY_PARAMETERS.SWAP.FROM]: currency.ticker,
                [QUERY_PARAMETERS.SWAP.TO]: isWrappedToken ? undefined : WRAPPED_TOKEN.ticker
              })
            }}
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
      </Flex>
    </Flex>
  );
};

export { ActionsCell };
export type { ActionsCellProps };
