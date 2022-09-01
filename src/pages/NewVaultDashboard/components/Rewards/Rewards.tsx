import {
  CollateralCurrencyExt,
  CollateralIdLiteral,
  newVaultId,
  WrappedCurrency,
  WrappedIdLiteral
} from '@interlay/interbtc-api';
import Big from 'big.js';
import { HTMLAttributes } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { LoadingSpinner } from '@/component-library/LoadingSpinner';
import ErrorModal from '@/components/ErrorModal';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { ZERO_GOVERNANCE_TOKEN_AMOUNT } from '@/utils/constants/currency';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';
import useAccountId from '@/utils/hooks/use-account-id';

import { InsightListItem, InsightsList } from '../InsightsList';
import {
  StyledCTA,
  StyledLoadingSpinnerWrapper,
  StyledRewardsTitleWrapper,
  StyledStakingTitle
} from './Rewards.styles';

type Props = {
  vaultAddress: string;
  apy: Big;
  wrappedId: WrappedIdLiteral;
  wrappedTokenRewards: VaultData['wrappedTokenRewards'];
  governanceTokenRewards: VaultData['governanceTokenRewards'];
  collateralId: CollateralIdLiteral;
  collateralToken: CollateralCurrencyExt;
};

type NativeAttrs = HTMLAttributes<unknown>;

type RewardsProps = Props & NativeAttrs;

const Rewards = ({
  vaultAddress,
  apy,
  collateralId,
  wrappedId,
  governanceTokenRewards,
  wrappedTokenRewards,
  collateralToken,
  ...props
}: RewardsProps): JSX.Element => {
  const queryClient = useQueryClient();
  const vaultAccountId = useAccountId(vaultAddress);

  const claimRewardsMutation = useMutation<void, Error, void>(
    () => {
      if (vaultAccountId === undefined) {
        throw new Error('Something went wrong!');
      }

      const vaultId = newVaultId(
        window.bridge.api,
        vaultAccountId.toString(),
        collateralToken,
        WRAPPED_TOKEN as WrappedCurrency
      );

      return window.bridge.rewards.withdrawRewards(vaultId);
    },
    { onSuccess: () => queryClient.invalidateQueries(['vaultsOverview', vaultAddress, collateralToken.ticker]) }
  );

  const handleClickWithdrawRewards = () => {
    claimRewardsMutation.mutate();
  };

  const hasWithdrawableRewards =
    !governanceTokenRewards.raw?.lte(ZERO_GOVERNANCE_TOKEN_AMOUNT) || !wrappedTokenRewards.raw.isZero();

  const stakingTitle = (
    <StyledRewardsTitleWrapper>
      <StyledStakingTitle>Rewards</StyledStakingTitle>
      <StyledCTA
        size='small'
        variant='outlined'
        onClick={handleClickWithdrawRewards}
        disabled={!hasWithdrawableRewards || claimRewardsMutation.isLoading}
        $loading={claimRewardsMutation.isLoading}
      >
        {/* TODO: temporary approach. Loading spinner should be added to the CTA itself */}
        {claimRewardsMutation.isLoading && (
          <StyledLoadingSpinnerWrapper>
            <LoadingSpinner variant='indeterminate' thickness={2} diameter={20} />
          </StyledLoadingSpinnerWrapper>
        )}
        Withdraw all rewards
      </StyledCTA>
      {claimRewardsMutation.isError && (
        <ErrorModal
          open={claimRewardsMutation.isError}
          onClose={() => claimRewardsMutation.reset()}
          title='Error'
          description={claimRewardsMutation.error?.message || ''}
        />
      )}
    </StyledRewardsTitleWrapper>
  );

  const stakingItems: InsightListItem[] = [
    { title: 'APR', label: formatPercentage(apy.toNumber()) },
    {
      title: `Fees earned ${wrappedId}`,
      label: formatNumber(wrappedTokenRewards.amount.toNumber()),
      sublabel: `(${formatUSD(wrappedTokenRewards.usd)})`
    },
    {
      title: `Fees earned ${collateralId}`,
      label: formatNumber(governanceTokenRewards.amount.toNumber()),
      sublabel: `(${formatUSD(governanceTokenRewards.usd)})`
    }
  ];

  return <InsightsList title={stakingTitle} direction='column' items={stakingItems} {...props} />;
};

export { Rewards };
export type { RewardsProps };
