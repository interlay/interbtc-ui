import { FixedPointNumber } from '@acala-network/sdk-core';
import { DefaultTransactionAPI } from '@interlay/interbtc-api';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import * as React from 'react';
import { useEffect } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import Accounts from '@/components/Accounts';
import AvailableBalanceUI from '@/components/AvailableBalanceUI';
import Chains, { ChainOption } from '@/components/Chains';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TokenField from '@/components/TokenField';
import { RELAY_CHAIN_NATIVE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';
import { ChainType } from '@/types/chains.types';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useXcmBridge } from './use-xcm-bridge';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
};

const CrossChainTransferForm = (): JSX.Element => {
  const { xcmBridge, xcmProvider } = useXcmBridge();
  // TODO: review how we're handling the relay chain api - for now it can
  // be scoped to this component, but long term it needs to be handled at
  // the application level.
  const [destination, setDestination] = React.useState<KeyringPair | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  // TODO: this could be removed form state using React hook form getValue/watch
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const { selectedAccount } = useSubstrateSecureState();
  const { parachainStatus } = useSelector((state: StoreType) => state.general);
  const { data: balances } = useGetBalances();

  // **************************

  // const onStatusChangeCallback = () => {
  //   console.log('onStatusChangeCallback');
  // };

  useEffect(() => {
    if (!xcmBridge || !xcmProvider || !selectedAccount) return;

    const sendTransaction = async () => {
      const { signer } = await web3FromAddress(selectedAccount.address.toString());

      const adapter = xcmBridge.findAdapter('polkadot');
      adapter.setApi(xcmProvider.getApiPromise('polkadot'));

      const apiPromise = xcmProvider.getApiPromise('polkadot');

      apiPromise.setSigner(signer);

      const tx = adapter.createTx({
        amount: FixedPointNumber.fromInner('10000000000', 10),
        to: 'interlay',
        token: 'DOT',
        address: selectedAccount.address
      });

      console.log(DefaultTransactionAPI, tx);

      // await DefaultTransactionAPI.sendLogged(apiPromise, selectedAccount.address, tx);
    };

    sendTransaction();
  }, [selectedAccount, xcmBridge, xcmProvider]);

  // **************************

  const onSubmit = async (data: CrossChainTransferFormData) => {
    if (!selectedAccount) return;
    if (!destination) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      if (!xcmBridge) return;

      // TODO: submit method
      console.log(newMonetaryAmount(data[TRANSFER_AMOUNT], RELAY_CHAIN_NATIVE_TOKEN, true));

      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedAccount) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  const handleUpdateUsdAmount = (value: string) => {
    if (!value) return;

    const tokenAmount = newMonetaryAmount(value, RELAY_CHAIN_NATIVE_TOKEN, true);
    const usd = displayMonetaryAmountInUSDFormat(
      tokenAmount,
      getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd
    );

    setApproxUsdValue(usd);
  };

  const validateTransferAmount = (value: string) => {
    console.log('validate transfer amount', value);
    return 'validating transfer amount';
  };

  const handleSetFromChain = (chain: ChainOption) => {
    console.log(chain);
  };

  const handleSetToChain = (chain: ChainOption) => {
    console.log(chain);
  };

  const balance = displayMonetaryAmount(balances?.[RELAY_CHAIN_NATIVE_TOKEN.ticker].transferable);

  const handleClickBalance = () => {
    setValue(TRANSFER_AMOUNT, balance);
    handleUpdateUsdAmount(balance);
    trigger(TRANSFER_AMOUNT);
  };

  // This ensures that triggering the notification and clearing
  // the form happen at the same time.
  React.useEffect(() => {
    if (submitStatus !== STATUSES.RESOLVED) return;

    toast.success(t('transfer_page.successfully_transferred'));

    reset({
      [TRANSFER_AMOUNT]: ''
    });
  }, [submitStatus, reset, t]);

  if (!xcmBridge) {
    return <PrimaryColorEllipsisLoader />;
  }

  const availableBalanceLabel = 'Available balance';

  return (
    <>
      <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>{t('transfer_page.cross_chain_transfer_form.title')}</FormTitle>
        <div>
          <AvailableBalanceUI
            label={availableBalanceLabel}
            balance={balance}
            tokenSymbol={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
            onClick={handleClickBalance}
          />
          <TokenField
            id={TRANSFER_AMOUNT}
            {...register(TRANSFER_AMOUNT, {
              onChange: (e) => handleUpdateUsdAmount(e.target.value),
              required: {
                value: true,
                message: t('transfer_page.cross_chain_transfer_form.please_enter_amount')
              },
              validate: (value) => validateTransferAmount(value)
            })}
            error={!!errors[TRANSFER_AMOUNT]}
            helperText={errors[TRANSFER_AMOUNT]?.message}
            label={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
            approxUSD={`≈ ${approxUsdValue}`}
          />
        </div>
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.from_chain')}
          selectedChain={ChainType.Parachain}
          onChange={handleSetFromChain}
        />
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.to_chain')}
          selectedChain={ChainType.RelayChain}
          onChange={handleSetToChain}
        />
        <Accounts
          label={t('transfer_page.cross_chain_transfer_form.target_account')}
          callbackFunction={setDestination}
        />
        <SubmitButton
          disabled={parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)}
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}
        >
          {selectedAccount ? t('transfer') : t('connect_wallet')}
        </SubmitButton>
      </form>
      {submitStatus === STATUSES.REJECTED && submitError && (
        <ErrorModal
          open={!!submitError}
          onClose={() => {
            setSubmitStatus(STATUSES.IDLE);
            setSubmitError(null);
          }}
          title='Error'
          description={typeof submitError === 'string' ? submitError : submitError.message}
        />
      )}
    </>
  );
};

export default withErrorBoundary(CrossChainTransferForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
