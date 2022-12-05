import { FixedPointNumber } from '@acala-network/sdk-core';
import { DefaultTransactionAPI } from '@interlay/interbtc-api';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { web3FromAddress } from '@polkadot/extension-dapp';
import * as React from 'react';
import { useEffect } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { firstValueFrom } from 'rxjs';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import Accounts from '@/components/Accounts';
import AvailableBalanceUI from '@/components/AvailableBalanceUI';
import Chains, { ChainOption } from '@/components/Chains';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import FormTitle from '@/components/FormTitle';
import PrimaryColorEllipsisLoader from '@/components/PrimaryColorEllipsisLoader';
import SubmitButton from '@/components/SubmitButton';
import TokenField from '@/components/TokenField';
// TODO: Pull tokens from xcmBridge response. This needs to be done to support USDT
// import { RELAY_CHAIN_NATIVE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { KeyringPair, useSubstrateSecureState } from '@/lib/substrate';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { useXcmBridge } from '../../../utils/hooks/api/xcm/use-xcm-bridge';

const TRANSFER_AMOUNT = 'transfer-amount';

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
};

const CrossChainTransferForm = (): JSX.Element => {
  const [fromChains, setFromChains] = React.useState<Array<ChainOption> | undefined>(undefined);
  const [fromChain, setFromChain] = React.useState<ChainOption | undefined>(undefined);
  const [toChains, setToChains] = React.useState<Array<ChainOption> | undefined>(undefined);
  const [toChain, setToChain] = React.useState<ChainOption | undefined>(undefined);
  const [transferableBalance, setTransferableBalance] = React.useState<any>(undefined);
  const [destination, setDestination] = React.useState<KeyringPair | undefined>(undefined);
  const [destinationBalance, setDestinationBalance] = React.useState<any>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

  // TODO: this will need to be refactored when we support multiple currencies
  // per channel, but so will the UI so better to handle this then.
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const { xcmBridge, xcmProvider } = useXcmBridge();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);

  const USDTSymbol = 'USDT';
  const USDTCurrency = getCurrencyFromTicker(USDTSymbol);

  console.log(USDTCurrency);

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

  useEffect(() => {
    if (!destination || !fromChain || !xcmBridge || !selectedAccount) return;

    const getDestinationBalance = async () => {
      const balance: any = await firstValueFrom(
        xcmBridge.findAdapter(fromChain.type).subscribeTokenBalance(USDTSymbol, destination.address)
      );

      console.log('balance.free.toString()', balance.free.toString());

      setDestinationBalance(newMonetaryAmount(balance.free.toString(), USDTCurrency, true));
    };

    getDestinationBalance();
  }, [USDTCurrency, destination, fromChain, xcmBridge, selectedAccount]);

  useEffect(() => {
    if (!xcmBridge) return;
    if (!fromChain) return;
    if (!selectedAccount) return;

    const getBalance = async () => {
      const balance: any = await firstValueFrom(
        xcmBridge.findAdapter(fromChain.type).subscribeTokenBalance(USDTSymbol, selectedAccount.address)
      );

      setTransferableBalance(balance.free);
    };

    getBalance();
  }, [fromChain, selectedAccount, xcmBridge]);

  useEffect(() => {
    if (!xcmBridge) return;
    if (!xcmProvider) return;

    const availableFromChains: Array<ChainOption> = xcmBridge.adapters.map((adapter: any) => {
      return { type: adapter.chain.id, name: adapter.chain.id };
    });

    setFromChains(availableFromChains);
    setFromChain(availableFromChains[0]);
  }, [xcmBridge, xcmProvider]);

  useEffect(() => {
    if (!xcmBridge) return;
    if (!fromChain) return;

    const destinationChains = xcmBridge.router.getDestinationChains({ from: fromChain.type });

    const availableToChains = destinationChains.map((chain: any) => {
      return { type: chain.id, name: chain.id };
    });

    console.log('fromChainfromChain', fromChain);

    setToChains(availableToChains);
    setToChain(availableToChains[0]);
  }, [fromChain, xcmBridge]);

  const onSubmit = async (data: CrossChainTransferFormData) => {
    if (!selectedAccount) return;
    if (!destination) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      if (!xcmBridge || !fromChain || !toChain) return;

      const sendTransaction = async () => {
        const { signer } = await web3FromAddress(selectedAccount.address.toString());

        console.log('fromChain.type, toChain.type', fromChain.type, toChain.type);

        const adapter = xcmBridge.findAdapter(fromChain.type);
        adapter.setApi(xcmProvider.getApiPromise(fromChain.type));

        const apiPromise = xcmProvider.getApiPromise(fromChain.type);

        apiPromise.setSigner(signer);

        const transferAmount = new MonetaryAmount(USDTCurrency, data[TRANSFER_AMOUNT]);
        const transferAmountString = transferAmount.toString(true);
        const transferAmountDecimals = transferAmount.currency.decimals;

        const tx = adapter.createTx({
          amount: FixedPointNumber.fromInner(transferAmountString, transferAmountDecimals),
          to: toChain.type,
          token: USDTSymbol,
          address: destination.address
        });

        console.log('txtx', tx);

        await DefaultTransactionAPI.sendLogged(apiPromise, selectedAccount.address, tx);
      };

      await sendTransaction();

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

    const tokenAmount = newMonetaryAmount(value, USDTCurrency, true);

    const usd = displayMonetaryAmountInUSDFormat(tokenAmount, getTokenPrice(prices, USDTSymbol)?.usd);

    setApproxUsdValue(usd);
  };

  const validateTransferAmount = async (value: string) => {
    console.log(value, destinationBalance);
    return undefined;
    // const balanceMonetaryAmount = newMonetaryAmount(transferableBalance, USDTCurrency, true);
    // const transferAmount = newMonetaryAmount(value, USDTCurrency, true);

    // if (destinationBalance.isZero()) {
    //   const ed = xcmBridge.findAdapter(toChain?.type).balanceAdapter.ed;
    //   const edAmount = newMonetaryAmount(ed.toString(), USDTCurrency, true);

    //   const inputConfig: any = await firstValueFrom(
    //     xcmBridge.findAdapter(fromChain?.type).subscribeInputConfigs({
    //       to: toChain?.type,
    //       token: USDTSymbol,
    //       address: destination?.address,
    //       signer: selectedAccount?.address
    //     })
    //   );

    //   const estimatedFee = newMonetaryAmount(inputConfig.estimateFee, USDTCurrency, true).toHuman();
    //   console.log(estimatedFee);

    //   return edAmount.gt(transferAmount) ? 'Existential deposit problem' : undefined;
    // } else if (balanceMonetaryAmount.lt(transferAmount)) {
    //   return t('insufficient_funds');
    // } else {
    //   return undefined;
    // }
  };

  const handleSetFromChain = (chain: ChainOption) => {
    setFromChain(chain);
  };

  const handleSetToChain = (chain: ChainOption) => {
    setToChain(chain);
  };

  const handleClickBalance = () => {
    setValue(TRANSFER_AMOUNT, transferableBalance);
    handleUpdateUsdAmount(transferableBalance);
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
            balance={transferableBalance?.toString() || '0'}
            tokenSymbol={USDTSymbol}
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
            label={USDTSymbol}
            approxUSD={`≈ ${approxUsdValue}`}
          />
        </div>
        <Chains
          chainOptions={fromChains}
          label={t('transfer_page.cross_chain_transfer_form.from_chain')}
          selectedChain={fromChain}
          onChange={handleSetFromChain}
        />
        <Chains
          chainOptions={toChains}
          label={t('transfer_page.cross_chain_transfer_form.to_chain')}
          selectedChain={toChain}
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
