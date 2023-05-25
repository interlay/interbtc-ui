import { CollateralCurrencyExt, newVaultId, WrappedCurrency, WrappedIdLiteral } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { CardProps } from '@/component-library';
import { LoadingSpinner } from '@/component-library/LoadingSpinner';
import { GOVERNANCE_TOKEN_SYMBOL, WRAPPED_TOKEN } from '@/config/relay-chains';
import ErrorModal from '@/legacy-components/ErrorModal';
import { ZERO_GOVERNANCE_TOKEN_AMOUNT } from '@/utils/constants/currency';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
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
  collateralToken: CollateralCurrencyExt;
  hasWithdrawRewardsBtn: boolean;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type RewardsProps = Props & InheritAttrs;

const Rewards = ({
  vaultAddress,
  apy,
  wrappedId,
  governanceTokenRewards,
  wrappedTokenRewards,
  collateralToken,
  hasWithdrawRewardsBtn,
  ...props
}: RewardsProps): JSX.Element => {
  const queryClient = useQueryClient();
  const vaultAccountId = useAccountId(vaultAddress);

  const transaction = useTransaction(Transaction.REWARDS_WITHDRAW, {
    onSuccess: () => {
      queryClient.invalidateQueries(['vaultsOverview', vaultAddress, collateralToken.ticker]);
      toast.success('Your rewards were successfully withdrawn.');
    }
  });

  const handleClickWithdrawRewards = () => {
    if (vaultAccountId === undefined) return;

    const vaultId = newVaultId(
      window.bridge.api,
      vaultAccountId.toString(),
      collateralToken,
      WRAPPED_TOKEN as WrappedCurrency
    );

    transaction.execute(vaultId);
  };

  const hasWithdrawableRewards =
    !governanceTokenRewards.raw?.lte(ZERO_GOVERNANCE_TOKEN_AMOUNT) || !wrappedTokenRewards.raw.isZero();

  const stakingTitle = (
    <StyledRewardsTitleWrapper>
      <StyledStakingTitle>Rewards</StyledStakingTitle>
      {hasWithdrawRewardsBtn && (
        <StyledCTA
          size='small'
          variant='outlined'
          onClick={handleClickWithdrawRewards}
          disabled={!hasWithdrawableRewards || transaction.isLoading}
          $loading={transaction.isLoading}
        >
          {/* TODO: temporary approach. Loading spinner should be added to the CTA itself */}
          {transaction.isLoading && (
            <StyledLoadingSpinnerWrapper>
              <LoadingSpinner variant='indeterminate' thickness={2} diameter={20} />
            </StyledLoadingSpinnerWrapper>
          )}
          Withdraw all rewards
        </StyledCTA>
      )}
      {transaction.isError && (
        <ErrorModal
          open={transaction.isError}
          onClose={() => transaction.reset()}
          title='Error'
          description={transaction.error?.message || ''}
        />
      )}
    </StyledRewardsTitleWrapper>
  );

  const stakingItems: InsightListItem[] = [
    { title: 'APR', label: `${formatNumber(apy.toNumber(), { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%` },
    {
      title: `Fees earned ${wrappedId}`,
      label: wrappedTokenRewards.amount.toString(),
      sublabel: `(${formatUSD(wrappedTokenRewards.usd)})`
    },
    {
      title: `Fees earned ${GOVERNANCE_TOKEN_SYMBOL}`,
      label: formatNumber(governanceTokenRewards.amount.toNumber()),
      sublabel: `(${formatUSD(governanceTokenRewards.usd)})`
    }
  ];

  return <InsightsList title={stakingTitle} direction='column' items={stakingItems} {...props} />;
};

export { Rewards };
export type { RewardsProps };
