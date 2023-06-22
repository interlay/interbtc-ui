import { LiquidityPool } from '@interlay/interbtc-api';
import Big from 'big.js';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatUSD } from '@/common/utils/utils';
import { Card, CTA, Dl, DlGroup, Flex, Modal, ModalBody, ModalFooter, ModalHeader } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import {
  ClaimRewardsPoolFormData,
  claimRewardsPoolSchema,
  POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD,
  useForm
} from '@/lib/form';
import { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD } from '@/pages/AMM/shared/utils';
import { AccountPoolsData } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTrasanctionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { StyledDd, StyledDt } from './PoolsInsights.style';
import { calculateClaimableFarmingRewardUSD } from './utils';

type PoolsInsightsProps = {
  pools: LiquidityPool[];
  accountPoolsData?: AccountPoolsData;
  refetch: () => void;
};

const PoolsInsights = ({ pools, accountPoolsData, refetch }: PoolsInsightsProps): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();
  const [isOpen, setOpen] = useState(false);
  const overlappingModalRef = useRef<HTMLDivElement>(null);

  const transaction = useTransaction(Transaction.AMM_CLAIM_REWARDS, {
    onSuccess: refetch,
    onSigning: () => setOpen(false)
  });

  const handleSubmit = () => {
    if (!accountPoolsData) return;

    transaction.execute(accountPoolsData.claimableRewards);
  };

  const form = useForm<ClaimRewardsPoolFormData>({
    initialValues: {
      [POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD]: ''
    },
    validationSchema: claimRewardsPoolSchema(),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      if (!accountPoolsData) return;

      const feeTicker = values[POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD];

      return transaction.fee.setCurrency(feeTicker).estimate(accountPoolsData.claimableRewards);
    }
  });

  // Doing this call on mount so that the form becomes dirty
  useEffect(() => {
    form.setFieldValue(POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accountPositions = accountPoolsData?.positions;

  const supplyAmountUSD = accountPositions?.reduce((acc, curr) => {
    const totalLiquidityUSD = calculateTotalLiquidityUSD(curr.data.pooledCurrencies, prices);

    const accountLiquidityUSD =
      curr.amount && !curr.data.isEmpty
        ? calculateAccountLiquidityUSD(curr.amount, totalLiquidityUSD, curr.data.totalSupply)
        : 0;

    return acc.add(accountLiquidityUSD);
  }, new Big(0));

  const supplyBalanceLabel = supplyAmountUSD ? formatUSD(supplyAmountUSD.toNumber() || 0, { compact: true }) : '-';

  const totalLiquidity = pools.reduce((acc, pool) => {
    const poolLiquidityUSD = calculateTotalLiquidityUSD(pool.pooledCurrencies, prices);

    return acc.add(poolLiquidityUSD);
  }, new Big(0));

  const totalLiquidityUSD = formatUSD(totalLiquidity?.toNumber() || 0, { compact: true });

  const totalClaimableRewardUSD = calculateClaimableFarmingRewardUSD(accountPoolsData?.claimableRewards, prices);
  const totalClaimableRewardUSDLabel = formatUSD(totalClaimableRewardUSD, { compact: true });

  const handleClickClaimRewards = () => setOpen(true);

  const hasClaimableRewards = totalClaimableRewardUSD > 0;

  const isBtnDisabled = isTrasanctionFormDisabled(form, transaction.fee);

  return (
    <>
      <Dl wrap direction='row'>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>{t('supply_balance')}</StyledDt>
            <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>{t('total_liquidity')}</StyledDt>
            <StyledDd color='secondary'>{totalLiquidityUSD}</StyledDd>
          </DlGroup>
        </Card>
        <Card direction='row' flex='1' gap='spacing2' alignItems='center' justifyContent='space-between'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>{t('rewards')}</StyledDt>
            <StyledDd color='secondary'>{totalClaimableRewardUSDLabel}</StyledDd>
          </DlGroup>
          {hasClaimableRewards && (
            <CTA onPress={handleClickClaimRewards} loading={transaction.isLoading}>
              Claim
            </CTA>
          )}
        </Card>
      </Dl>
      <Modal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        shouldCloseOnInteractOutside={(el) => !overlappingModalRef.current?.contains(el)}
      >
        <ModalHeader>Claim Rewards</ModalHeader>
        <ModalBody>
          <TransactionDetails>
            <TransactionDetailsGroup>
              <TransactionDetailsDt>Amount</TransactionDetailsDt>
              <TransactionDetailsDd>{totalClaimableRewardUSDLabel}</TransactionDetailsDd>
            </TransactionDetailsGroup>
          </TransactionDetails>
        </ModalBody>
        <ModalFooter>
          <form onSubmit={form.handleSubmit}>
            <Flex direction='column' gap='spacing4'>
              <TransactionFeeDetails
                {...transaction.fee.detailsProps}
                selectProps={{
                  ...form.getFieldProps(POOL_CLAIM_REWARDS_FEE_TOKEN_FIELD),
                  modalRef: overlappingModalRef
                }}
              />
              <AuthCTA type='submit' size='large' disabled={isBtnDisabled}>
                {t('claim_rewards')}
              </AuthCTA>
            </Flex>
          </form>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { PoolsInsights };
export type { PoolsInsightsProps };
