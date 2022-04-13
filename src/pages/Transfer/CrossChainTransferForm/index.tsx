
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { newMonetaryAmount } from '@interlay/interbtc-api';

import Accounts from 'components/Accounts';
import AvailableBalanceUI from 'components/AvailableBalanceUI';
import Chains, {
  ChainOption
} from 'components/Chains';
import TokenField from 'components/TokenField';
import ErrorFallback from 'components/ErrorFallback';
import FormTitle from 'components/FormTitle';
import SubmitButton from 'components/SubmitButton';
import ErrorModal from 'components/ErrorModal';
import {
  COLLATERAL_TOKEN,
  COLLATERAL_TOKEN_SYMBOL
} from 'config/relay-chains';
import { showAccountModalAction } from 'common/actions/general.actions';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import { ChainType } from 'types/chains.types';
import STATUSES from 'utils/constants/statuses';
import {
  RELAY_CHAIN_TRANSFER_FEE,
  createRelayChainApi,
  getRelayChainBalance,
  getExistentialDeposit,
  transferToParachain,
  transferToRelayChain,
  RelayChainApi,
  RelayChainMonetaryAmount
} from 'utils/relay-chain-api';

const TRANSFER_AMOUNT = 'transfer-amount';

const transferFee = newMonetaryAmount(RELAY_CHAIN_TRANSFER_FEE, COLLATERAL_TOKEN);

type CrossChainTransferFormData = {
  [TRANSFER_AMOUNT]: string;
}

const CrossChainTransferForm = (): JSX.Element => {
  // TODO: review how we're handling the relay chain api - for now it can
  // be scoped to this component, but long term it needs to be handled at
  // the application level.
  const [api, setApi] = React.useState<RelayChainApi | undefined>(undefined);
  const [relayChainBalance, setRelayChainBalance] = React.useState<RelayChainMonetaryAmount | undefined>(undefined);
  const [fromChain, setFromChain] = React.useState<ChainType | undefined>(ChainType.RelayChain);
  const [toChain, setToChain] = React.useState<ChainType | undefined>(ChainType.Parachain);
  const [destination, setDestination] = React.useState<InjectedAccountWithMeta | undefined>(undefined);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  // TODO: this could be removed form state using React hook form getValue/watch
  const [approxUsdValue, setApproxUsdValue] = React.useState<string>('0');

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CrossChainTransferFormData>({
    mode: 'onChange'
  });

  const {
    address,
    collateralTokenTransferableBalance,
    parachainStatus,
    prices
  } = useSelector((state: StoreType) => state.general);

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
          newMonetaryAmount(data[TRANSFER_AMOUNT], COLLATERAL_TOKEN, true)
        );
      } else {
        await transferToRelayChain(
          window.bridge.api,
          address,
          destination.address,
          newMonetaryAmount(data[TRANSFER_AMOUNT], COLLATERAL_TOKEN, true)
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

  const handleUpdateUsdAmount = (event: any) => {
    if (!event.target.value) return;

    const value = newMonetaryAmount(event.target.value, COLLATERAL_TOKEN, true);
    const usd = getUsdAmount(value, prices.collateralToken.usd);

    setApproxUsdValue(usd);
  };

  const validateRelayChainTransferAmount = (value: number): string | undefined => {
    const transferAmount = newMonetaryAmount(value, COLLATERAL_TOKEN, true);

    return relayChainBalance?.lt(transferAmount) ? t('insufficient_funds') : undefined;
  };

  const validateParachainTransferAmount = (value: number): string | undefined => {
    const transferAmount = newMonetaryAmount(value, COLLATERAL_TOKEN, true);

    // TODO: this api check won't be necessary when the api call is moved out of
    // the component
    const existentialDeposit = api ?
      newMonetaryAmount(getExistentialDeposit(api), COLLATERAL_TOKEN) :
      newMonetaryAmount('0', COLLATERAL_TOKEN);

    // TODO: we need to handle and validate transfer fees properly. Implemented here initially
    // because it was an issue during testing.
    if (collateralTokenTransferableBalance.lt(transferAmount)) {
      return t('insufficient_funds');
      // Check transferred amount won't be below existential deposit when fees are deducted
      // This check is redundant if the relay chain balance is above zero
    } else if (relayChainBalance?.isZero() && transferAmount.sub(transferFee).lt(existentialDeposit)) {
      return t('transfer_page.cross_chain_transfer_form.insufficient_funds_to_maintain_existential_depoit');
      // Check the transfer amount is more than the fee
    } else if (transferAmount.lte(transferFee)) {
      return t('transfer_page.cross_chain_transfer_form.insufficient_funds_to_pay_fees', {
        transferFee: `${displayMonetaryAmount(transferFee)} ${COLLATERAL_TOKEN_SYMBOL}`
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
  }, [
    api,
    handleError
  ]);

  React.useEffect(() => {
    if (!api) return;
    if (!handleError) return;
    if (relayChainBalance) return;

    const fetchRelayChainBalance = async () => {
      try {
        const balance: any = await getRelayChainBalance(api, address);
        setRelayChainBalance(balance.sub(transferFee));
      } catch (error) {
        handleError(error);
      }
    };

    fetchRelayChainBalance();
  }, [
    api,
    address,
    handleError,
    relayChainBalance
  ]);

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

  // This ensures that triggering the notification and clearing
  // the form happen at the same time.
  React.useEffect(() => {
    if (submitStatus !== STATUSES.RESOLVED) return;

    toast.success(t('transfer_page.successfully_transferred'));

    reset({
      [TRANSFER_AMOUNT]: ''
    });
  }, [
    submitStatus,
    reset,
    t
  ]);

  return (
    <>
      {api && (
        <>
          <form
            className='space-y-8'
            onSubmit={handleSubmit(onSubmit)}>
            <FormTitle>
              {t('transfer_page.cross_chain_transfer_form.title')}
            </FormTitle>
            <div>
              {fromChain === ChainType.RelayChain ? (
                <AvailableBalanceUI
                  label={t('transfer_page.cross_chain_transfer_form.relay_chain_balance')}
                  balance={displayMonetaryAmount(relayChainBalance)}
                  tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />) : (
                <AvailableBalanceUI
                  label={t('transfer_page.cross_chain_transfer_form.parachain_balance')}
                  balance={displayMonetaryAmount(collateralTokenTransferableBalance)}
                  tokenSymbol={COLLATERAL_TOKEN_SYMBOL} />)
              }
              <TokenField
                onChange={handleUpdateUsdAmount}
                id={TRANSFER_AMOUNT}
                name={TRANSFER_AMOUNT}
                ref={register({
                  required: {
                    value: true,
                    message: t('transfer_page.cross_chain_transfer_form.please_enter_amount')
                  },
                  validate: value => fromChain === ChainType.RelayChain ?
                    validateRelayChainTransferAmount(value) :
                    validateParachainTransferAmount(value)
                })}
                error={!!errors[TRANSFER_AMOUNT]}
                helperText={errors[TRANSFER_AMOUNT]?.message}
                label={COLLATERAL_TOKEN_SYMBOL}
                approxUSD={`≈ $ ${approxUsdValue}`} />
            </div>
            <Chains
              label={t('transfer_page.cross_chain_transfer_form.from_chain')}
              selectedChain={fromChain}
              onChange={handleSetFromChain} />
            <Chains
              label={t('transfer_page.cross_chain_transfer_form.to_chain')}
              selectedChain={toChain}
              onChange={handleSetToChain} />
            <Accounts
              label={t('transfer_page.cross_chain_transfer_form.target_account')}
              callbackFunction={setDestination} />
            <SubmitButton
              disabled={
                parachainStatus === (ParachainStatus.Loading || ParachainStatus.Shutdown)
              }
              pending={submitStatus === STATUSES.PENDING}
              onClick={handleConfirmClick}>
              {address ? (
                t('transfer')
              ) : (
                t('connect_wallet')
              )}
            </SubmitButton>
          </form>
          {(submitStatus === STATUSES.REJECTED && submitError) && (
            <ErrorModal
              open={!!submitError}
              onClose={() => {
                setSubmitStatus(STATUSES.IDLE);
                setSubmitError(null);
              }}
              title='Error'
              description={
                typeof submitError === 'string' ?
                  submitError :
                  submitError.message
              } />
          )}
        </>
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
