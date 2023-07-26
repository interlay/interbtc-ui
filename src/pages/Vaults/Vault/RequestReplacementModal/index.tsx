import { CollateralCurrencyExt, GovernanceCurrency } from '@interlay/interbtc-api';
import { Bitcoin, BitcoinAmount, ExchangeRate, MonetaryAmount } from '@interlay/monetary-js';
import { Big } from 'big.js';
import clsx from 'clsx';
import * as React from 'react';
import { useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount } from '@/common/utils/utils';
import { Modal, ModalBody, ModalHeader } from '@/component-library';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { DEFAULT_REDEEM_DUST_AMOUNT } from '@/config/parachain';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL, TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { Transaction, useTransaction } from '@/hooks/transaction';
import InterlayCinnabarOutlinedButton from '@/legacy-components/buttons/InterlayCinnabarOutlinedButton';
import InterlayMulberryOutlinedButton from '@/legacy-components/buttons/InterlayMulberryOutlinedButton';
import ErrorMessage from '@/legacy-components/ErrorMessage';
import NumberInput from '@/legacy-components/NumberInput';
import PrimaryColorEllipsisLoader from '@/legacy-components/PrimaryColorEllipsisLoader';
import { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import STATUSES from '@/utils/constants/statuses';
import { getExchangeRate } from '@/utils/helpers/oracle';

const AMOUNT = 'amount';

type RequestReplacementFormData = {
  [AMOUNT]: number;
};

interface Props {
  onClose: () => void;
  open: boolean;
  collateralToken: CollateralCurrencyExt;
  vaultAddress: string;
  lockedBTC: BitcoinAmount;
  collateralAmount: MonetaryAmount<CollateralCurrencyExt>;
}

const RequestReplacementModal = ({
  onClose,
  open,
  collateralToken,
  vaultAddress,
  lockedBTC,
  collateralAmount
}: Props): JSX.Element | null => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<RequestReplacementFormData>();
  const amount = watch(AMOUNT) || '0';

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();
  const { isLoading: isBalancesLoading, data: balances } = useGetBalances();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [griefingRate, setGriefingRate] = React.useState(new Big(10.0)); // Set default to 10%
  const [dustValue, setDustValue] = React.useState(new BitcoinAmount(DEFAULT_REDEEM_DUST_AMOUNT));
  const [btcToGovernanceTokenRate, setBTCToGovernanceTokenRate] = React.useState(
    new ExchangeRate<Bitcoin, GovernanceCurrency>(Bitcoin, GOVERNANCE_TOKEN, new Big(0))
  );
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);

  const transaction = useTransaction(Transaction.REPLACE_REQUEST);

  useEffect(() => {
    if (!bridgeLoaded) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [theGriefingRate, theDustValue, theBtcToGovernanceTokenRate] = await Promise.all([
          window.bridge.fee.getReplaceGriefingCollateralRate(),
          window.bridge.redeem.getDustValue(),
          getExchangeRate(GOVERNANCE_TOKEN)
        ]);
        setGriefingRate(theGriefingRate);
        setDustValue(theDustValue);
        setBTCToGovernanceTokenRate(theBtcToGovernanceTokenRate);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [bridgeLoaded, handleError, setError, t]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      const amountPolkaBtc = new BitcoinAmount(data[AMOUNT]);

      await transaction.executeAsync(amountPolkaBtc, collateralToken);

      const vaultId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, vaultAddress);
      queryClient.invalidateQueries([GENERIC_FETCHER, 'mapReplaceRequests', vaultId]);
      setSubmitStatus(STATUSES.RESOLVED);
      onClose();
    } catch (error: any) {
      transaction.reject(error);
      setSubmitStatus(STATUSES.REJECTED);
    }
  });

  if (status === STATUSES.IDLE || status === STATUSES.PENDING || isBalancesLoading) {
    return <PrimaryColorEllipsisLoader />;
  }

  if (status === STATUSES.RESOLVED) {
    const validateAmount = (value: number): string | undefined => {
      const governanceTokenBalance = balances?.[GOVERNANCE_TOKEN.ticker];

      if (governanceTokenBalance === undefined) return;

      const wrappedTokenAmount = new BitcoinAmount(value);
      if (wrappedTokenAmount.lte(BitcoinAmount.zero())) {
        return t('Amount must be greater than zero!');
      }

      if (wrappedTokenAmount.gt(lockedBTC)) {
        return t(`Amount must be less than locked BTC balance!`);
      }

      if (wrappedTokenAmount.lte(dustValue)) {
        return t(`Please enter an amount greater than Bitcoin dust (${dustValue.toString()} BTC)`);
      }

      const securityDeposit = btcToGovernanceTokenRate.toCounter(wrappedTokenAmount).mul(griefingRate);
      const minRequiredGovernanceTokenAmount = TRANSACTION_FEE_AMOUNT.add(securityDeposit);
      if (governanceTokenBalance.free.lte(minRequiredGovernanceTokenAmount)) {
        return t('insufficient_funds_governance_token', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        });
      }

      return undefined;
    };

    const wrappedTokenAmount = new BitcoinAmount(amount);
    const securityDeposit = btcToGovernanceTokenRate.toCounter(wrappedTokenAmount).mul(griefingRate);

    return (
      <Modal isOpen={open} onClose={onClose}>
        <ModalHeader>{t('vault.request_replacement')}</ModalHeader>
        <ModalBody>
          <form className='space-y-4' onSubmit={onSubmit}>
            <p>{t('vault.withdraw_your_collateral')}</p>
            <p>{t('vault.you_have')}</p>
            <p>
              {t('locked_collateral')} {displayMonetaryAmount(collateralAmount)} {collateralToken.ticker}
            </p>
            <p>
              {t('locked')} {lockedBTC.toHuman(8)} BTC
            </p>
            <p>{t('vault.replace_amount')}</p>
            <div>
              <NumberInput
                min={0}
                {...register(AMOUNT, {
                  required: {
                    value: true,
                    message: t('Amount is required!')
                  },
                  validate: (value) => validateAmount(value)
                })}
              />
              <ErrorMessage>{errors[AMOUNT]?.message}</ErrorMessage>
            </div>
            <p>
              {t(`griefing_collateral`)} {securityDeposit.toHuman()} {GOVERNANCE_TOKEN.ticker}
            </p>
            <div className={clsx('flex', 'justify-end', 'space-x-2')}>
              <InterlayMulberryOutlinedButton onClick={onClose}>{t('cancel')}</InterlayMulberryOutlinedButton>
              <InterlayCinnabarOutlinedButton type='submit' pending={submitStatus === STATUSES.PENDING}>
                {t('request')}
              </InterlayCinnabarOutlinedButton>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
  return null;
};

export default RequestReplacementModal;
