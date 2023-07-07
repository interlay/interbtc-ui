import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber, formatPercentage, formatUSD } from '@/common/utils/utils';
import { Card, Dl, DlGroup, Flex, Modal, ModalBody, ModalFooter, ModalHeader } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import {
  claimRewardsLoanSchema,
  ClaimRewardsLoansFormData,
  LOAN_CLAIM_REWARDS_FEE_TOKEN_FIELD,
  useForm
} from '@/lib/form';
import { AccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetAccountSubsidyRewards } from '@/utils/hooks/api/loans/use-get-account-subsidy-rewards';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import { isTransactionFormDisabled } from '@/utils/hooks/transaction/utils/form';

import { StyledDd, StyledDt } from './LoansInsights.style';

type LoansInsightsProps = {
  statistics?: AccountLendingStatistics;
};

const LoansInsights = ({ statistics }: LoansInsightsProps): JSX.Element => {
  const { t } = useTranslation();

  const { data: subsidyRewards, refetch } = useGetAccountSubsidyRewards();

  const [isOpen, setOpen] = useState(false);
  const overlappingModalRef = useRef<HTMLDivElement>(null);

  const transaction = useTransaction(Transaction.LOANS_CLAIM_REWARDS, {
    onSuccess: refetch,
    onSigning: () => setOpen(false)
  });

  const form = useForm<ClaimRewardsLoansFormData>({
    initialValues: {
      [LOAN_CLAIM_REWARDS_FEE_TOKEN_FIELD]: ''
    },
    validationSchema: claimRewardsLoanSchema(),
    onSubmit: () => transaction.execute(),
    onComplete: async (values) => {
      const feeTicker = values[LOAN_CLAIM_REWARDS_FEE_TOKEN_FIELD];

      return transaction.fee.setCurrency(feeTicker).estimate();
    }
  });

  // Doing this call on mount so that the form becomes dirty
  // TODO: improve approach
  useEffect(() => {
    if (!isOpen) return;

    form.setFieldValue(LOAN_CLAIM_REWARDS_FEE_TOKEN_FIELD, transaction.fee.defaultCurrency.ticker, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { supplyAmountUSD, netAPY } = statistics || {};

  const supplyBalanceLabel = formatUSD(supplyAmountUSD?.toNumber() || 0);
  // TODO: temporary until squid has earned interest calculation.
  // const netBalanceLabel = formatUSD(netAmountUSD?.toNumber() || 0);
  const netPercentage = formatPercentage(netAPY?.toNumber() || 0);
  const netPercentageLabel = `${netAPY?.gt(0) ? '+' : ''}${netPercentage}`;

  const subsidyRewardsAmount = formatNumber(subsidyRewards?.total.toBig().toNumber() || 0, {
    maximumFractionDigits: subsidyRewards?.total.currency.humanDecimals || 5
  });
  const subsidyRewardsAmountLabel = `${subsidyRewardsAmount} ${subsidyRewards?.total.currency.ticker || ''}`;
  const hasSubsidyRewards = !!subsidyRewards && !subsidyRewards?.total.isZero();

  const isModalBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <>
      <Dl wrap direction='row'>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Supply Balance</StyledDt>
            <StyledDd color='secondary'>{supplyBalanceLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card flex='1'>
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Net APY</StyledDt>
            {/* {netPercentageLabel} ({netBalanceLabel}) */}
            <StyledDd color='secondary'>{netPercentageLabel}</StyledDd>
          </DlGroup>
        </Card>
        <Card
          direction='row'
          flex={hasSubsidyRewards ? '1.5' : '1'}
          gap='spacing2'
          alignItems='center'
          justifyContent='space-between'
        >
          <DlGroup direction='column' alignItems='flex-start' gap='spacing1'>
            <StyledDt color='primary'>Rewards</StyledDt>
            <StyledDd color='secondary'>{subsidyRewardsAmountLabel}</StyledDd>
          </DlGroup>
          {hasSubsidyRewards && (
            <AuthCTA onPress={() => setOpen(true)} loading={transaction.isLoading}>
              Claim
            </AuthCTA>
          )}
        </Card>
      </Dl>
      {hasSubsidyRewards && (
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
                <TransactionDetailsDd>{subsidyRewardsAmountLabel}</TransactionDetailsDd>
              </TransactionDetailsGroup>
            </TransactionDetails>
          </ModalBody>
          <ModalFooter>
            <form onSubmit={form.handleSubmit}>
              <Flex direction='column' gap='spacing4'>
                <TransactionFeeDetails
                  {...transaction.fee.detailsProps}
                  selectProps={{
                    ...form.getSelectFieldProps(LOAN_CLAIM_REWARDS_FEE_TOKEN_FIELD),
                    modalRef: overlappingModalRef
                  }}
                />
                <AuthCTA type='submit' size='large' disabled={isModalBtnDisabled}>
                  {t('claim_rewards')}
                </AuthCTA>
              </Flex>
            </form>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export { LoansInsights };
export type { LoansInsightsProps };
