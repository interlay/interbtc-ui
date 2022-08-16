import { newMonetaryAmount } from '@interlay/interbtc-api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, getUsdAmount } from '@/common/utils/utils';
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
import { ChainType } from '@/types/chains.types';
import STATUSES from '@/utils/constants/statuses';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import {
  createRelayChainApi,
  getExistentialDeposit,
  getRelayChainBalance,
  RELAY_CHAIN_TRANSFER_FEE,
  RelayChainApi,
  RelayChainMonetaryAmount,
  transferToParachain,
  transferToRelayChain
} from '@/utils/relay-chain-api';

const TRANSFER_AMOUNT = 'transfer-amount';

const transferFee = newMonetaryAmount(RELAY_CHAIN_TRANSFER_FEE, RELAY_CHAIN_NATIVE_TOKEN);

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
};

const CrossChainTransferForm = (): JSX.Element => {
  // TODO: review how we're handling the relay chain api - for now it can
  // be scoped to this component, but long term it needs to be handled at
  // the application level.
  const [api, setApi] = React.useState<RelayChainApi | undefined>(undefined);
  const [relayChainBalance, setRelayChainBalance] = React.useState<RelayChainMonetaryAmount | undefined>(undefined);
  const [destinationRelayChainBalance, setDestinationRelayChainBalance] = React.useState<
    RelayChainMonetaryAmount | undefined
  >(undefined);
  const [fromChain, setFromChain] = React.useState<ChainType | undefined>(ChainType.RelayChain);
  const [toChain, setToChain] = React.useState<ChainType | undefined>(ChainType.Parachain);
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  // TODO: this could be removed form state using React hook form getValue/watch
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();
  const handleError = useErrorHandler();

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

  const { address, collateralTokenTransferableBalance, parachainStatus } = useSelector(
    (state: StoreType) => state.general
  );

  const onSubmit = async (data: CrossChainTransferFormData) => {
    if (!address) return;
    if (!destination) return;

    try {
      setSubmitStatus(STATUSES.PENDING);

      if (!api) return;

      // We can use if else here as we only support two chains
      if (fromChain === ChainType.RelayChain) {
        await transferToParachain(
          api,
          address,
          destination.address,
          newMonetaryAmount(data[TRANSFER_AMOUNT], RELAY_CHAIN_NATIVE_TOKEN, true)
        );
      } else {
        await transferToRelayChain(
          window.bridge.api,
          address,
          destination.address,
          newMonetaryAmount(data[TRANSFER_AMOUNT], RELAY_CHAIN_NATIVE_TOKEN, true)
        );
      }

      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!address) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  const handleUpdateUsdAmount = (value: string) => {
    if (!value) return;

    const tokenAmount = newMonetaryAmount(value, RELAY_CHAIN_NATIVE_TOKEN, true);
    // ray test touch <
    const usd = getUsdAmount(tokenAmount, getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd);
    // ray test touch >

    setApproxUsdValue(usd);
  };

  const validateRelayChainTransferAmount = (value: string): string | undefined => {
    const transferAmount = newMonetaryAmount(value, RELAY_CHAIN_NATIVE_TOKEN, true);

    return relayChainBalance?.lt(transferAmount) ? t('insufficient_funds') : undefined;
  };

  const validateParachainTransferAmount = (value: string): string | undefined => {
    const transferAmount = newMonetaryAmount(value, RELAY_CHAIN_NATIVE_TOKEN, true);

    // TODO: this api check won't be necessary when the api call is moved out of
    // the component
    const existentialDeposit = api
      ? newMonetaryAmount(getExistentialDeposit(api), RELAY_CHAIN_NATIVE_TOKEN)
      : newMonetaryAmount('0', RELAY_CHAIN_NATIVE_TOKEN);

    // TODO: we need to handle and validate transfer fees properly. Implemented here initially
    // because it was an issue during testing.
    if (collateralTokenTransferableBalance.lt(transferAmount)) {
      return t('insufficient_funds');
      // Check transferred amount won't be below existential deposit when fees are deducted
      // This check is redundant if the relay chain balance is above zero
    } else if (
      destinationRelayChainBalance &&
      transferAmount.add(destinationRelayChainBalance).sub(transferFee).lt(existentialDeposit)
    ) {
      return t('transfer_page.cross_chain_transfer_form.insufficient_funds_to_maintain_existential_deposit', {
        transferFee: `${displayMonetaryAmount(transferFee)} ${RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}`,
        existentialDeposit: `${displayMonetaryAmount(existentialDeposit)} ${RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}`
      });
      // Check the transfer amount is more than the fee
    } else if (transferAmount.lte(transferFee)) {
      return t('transfer_page.cross_chain_transfer_form.insufficient_funds_to_pay_fees', {
        transferFee: `${displayMonetaryAmount(transferFee)} ${RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}`
      });
    } else {
      return undefined;
    }
  };

  React.useEffect(() => {
    if (api) return;
    if (!handleError) return;

    const initialiseApi = async () => {
      try {
        const api = await createRelayChainApi();
        setApi(api);
      } catch (error) {
        handleError(error);
      }
    };

    initialiseApi();
  }, [api, handleError]);

  React.useEffect(() => {
    if (!api) return;
    if (!handleError) return;
    if (!destination) return;

    const fetchDestinationRelayChainBalance = async () => {
      try {
        const balance: any = await getRelayChainBalance(api, destination?.address);
        setDestinationRelayChainBalance(balance);
      } catch (error) {
        handleError(error);
      }
    };

    fetchDestinationRelayChainBalance();
  }, [api, destination, handleError]);

  React.useEffect(() => {
    if (!api) return;
    if (!handleError) return;
    if (!address) return;

    const fetchRelayChainBalance = async () => {
      try {
        const balance: any = await getRelayChainBalance(api, address);
        setRelayChainBalance(balance.sub(transferFee));
      } catch (error) {
        handleError(error);
      }
    };

    fetchRelayChainBalance();
  }, [api, address, handleError]);

  const handleSetFromChain = (chain: ChainOption) => {
    setFromChain(chain.type);

    // prevent toChain having the same value as fromChain
    if (chain.type === toChain) {
      setToChain(chain.type === ChainType.Parachain ? ChainType.RelayChain : ChainType.Parachain);
    }
  };

  const handleSetToChain = (chain: ChainOption) => {
    setToChain(chain.type);

    // prevent fromChain having the same value as toChain
    if (chain.type === fromChain) {
      setFromChain(chain.type === ChainType.Parachain ? ChainType.RelayChain : ChainType.Parachain);
    }
  };

  const isRelayChain = fromChain === ChainType.RelayChain;
  const chainBalance = isRelayChain ? relayChainBalance : collateralTokenTransferableBalance;
  const balance = displayMonetaryAmount(chainBalance);

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

  if (!api) {
    return <PrimaryColorEllipsisLoader />;
  }

  const availableBalanceLabel = isRelayChain
    ? t('transfer_page.cross_chain_transfer_form.relay_chain_balance')
    : t('transfer_page.cross_chain_transfer_form.parachain_balance');

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
              validate: (value) =>
                isRelayChain ? validateRelayChainTransferAmount(value) : validateParachainTransferAmount(value)
            })}
            error={!!errors[TRANSFER_AMOUNT]}
            helperText={errors[TRANSFER_AMOUNT]?.message}
            label={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
            approxUSD={`≈ $ ${approxUsdValue}`}
          />
        </div>
        <Chains
          label={t('transfer_page.cross_chain_transfer_form.from_chain')}
          selectedChain={fromChain}
          onChange={handleSetFromChain}
        />
        <Chains
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
          {address ? t('transfer') : t('connect_wallet')}
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
