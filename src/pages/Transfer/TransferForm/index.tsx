
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { BitcoinAmount } from '@interlay/monetary-js';
import { newMonetaryAmount } from '@interlay/interbtc-api';

import TokenAmountField from '../TokenAmountField';
import Balances from '../../../parts/Topbar/Balances';
import SubmitButton from '../SubmitButton';
import FormTitle from '../FormTitle';
import TextField from 'components/TextField';
import InterlayModal, {
  InterlayModalTitle,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import
InterlayDenimOrKintsugiMidnightOutlinedButton from
  'components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import ErrorModal from 'components/ErrorModal';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  WrappedTokenLogoIcon
} from 'config/relay-chains';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import { displayMonetaryAmount } from 'common/utils/utils';
import { showAccountModalAction } from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as AcalaLogoIcon } from 'assets/img/acala-logo.svg';
import { ReactComponent as PlasmLogoIcon } from 'assets/img/plasm-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'assets/img/ethereum-logo.svg';
import { ReactComponent as CosmosLogoIcon } from 'assets/img/cosmos-logo.svg';

const WRAPPED_TOKEN_INPUT_AMOUNT = 'wrapped-token-input-amount';
const COLLATERAL_TOKEN_ADDRESS = 'collateral-token-address';

type TransferFormData = {
  [WRAPPED_TOKEN_INPUT_AMOUNT]: string;
  [COLLATERAL_TOKEN_ADDRESS]: string;
}

const NETWORK_TYPES = Object.freeze({
  INTER_BTC: 'inter-btc',
  ACALA: 'acala',
  PLASM: 'plasm',
  ETHEREUM: 'ethereum',
  COSMOS: 'cosmos'
});

const NETWORK_ITEMS = [
  {
    type: NETWORK_TYPES.INTER_BTC,
    icon: (
      <WrappedTokenLogoIcon width={20} />
    ),
    title: WRAPPED_TOKEN_SYMBOL
  },
  {
    type: NETWORK_TYPES.ACALA,
    icon: (
      <AcalaLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Acala',
    disabled: true
  },
  {
    type: NETWORK_TYPES.PLASM,
    icon: (
      <PlasmLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Plasm',
    disabled: true
  },
  {
    type: NETWORK_TYPES.ETHEREUM,
    icon: (
      <EthereumLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Ethereum',
    disabled: true
  },
  {
    type: NETWORK_TYPES.COSMOS,
    icon: (
      <CosmosLogoIcon
        width={20}
        height={20} />
    ),
    title: 'Cosmos',
    disabled: true
  }
];

const TransferForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // TODO (this ticket): Add governance token balance to state.general
  const {
    wrappedTokenBalance,
    collateralTokenBalance,
    parachainStatus,
    address
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TransferFormData>({
    mode: 'onChange'
  });

  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = React.useState(NETWORK_TYPES.INTER_BTC);
  const [activeTokenBalance, setActiveTokenBalance] = React.useState<number>(0);

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const handleNetworkModalOpen = () => {
    setNetworkModalOpen(true);
  };
  const handleNetworkModalClose = () => {
    setNetworkModalOpen(false);
  };

  const onSubmit = async (data: TransferFormData) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      await window.bridge.interBtcApi.tokens.transfer(
        data[COLLATERAL_TOKEN_ADDRESS],
        newMonetaryAmount(data[WRAPPED_TOKEN_INPUT_AMOUNT], WRAPPED_TOKEN, true)
      );
      setSubmitStatus(STATUSES.RESOLVED);
      toast.success(t('transfer_page.successfully_transferred'));
      reset({
        [WRAPPED_TOKEN_INPUT_AMOUNT]: '',
        [COLLATERAL_TOKEN_ADDRESS]: ''
      });
    } catch (error: any) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateForm = (value: number): string | undefined => {
    // TODO: should use wrapped token amount type (e.g. InterBtcAmount or KBtcAmount)
    if (wrappedTokenBalance === BitcoinAmount.zero) {
      return t('insufficient_funds');
    }

    if (collateralTokenBalance === newMonetaryAmount(0, COLLATERAL_TOKEN)) {
      return t('insufficient_funds_dot', {
        collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
      });
    }

    const bitcoinAmountValue = BitcoinAmount.from.BTC(value);
    if (bitcoinAmountValue.gt(wrappedTokenBalance)) {
      return `${t('redeem_page.current_balance')}${displayMonetaryAmount(wrappedTokenBalance)}`;
    }

    return undefined;
  };

  const selectedNetworkItem = NETWORK_ITEMS.find(networkItem => networkItem.type === selectedNetworkType);
  if (!selectedNetworkItem) {
    throw new Error('Something went wrong!'); // TODO: hardcoded
  }

  const accountSet = !!address;

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!accountSet) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  // TODO: export token type from Balances
  const beACallback = (token: any) => {
    setActiveTokenBalance(token.balance);
  };

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>
          {t('transfer_page.transfer_currency')}
        </FormTitle>
        <p>Balance: {activeTokenBalance}</p>
        <div
          className={clsx(
            'flex',
            'gap-2'
          )}>
          <Balances callbackFunction={beACallback} />
          <TokenAmountField
            id={WRAPPED_TOKEN_INPUT_AMOUNT}
            name={WRAPPED_TOKEN_INPUT_AMOUNT}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              },
              validate: value => validateForm(value)
            })}
            error={!!errors[WRAPPED_TOKEN_INPUT_AMOUNT]}
            helperText={errors[WRAPPED_TOKEN_INPUT_AMOUNT]?.message} />
        </div>
        <div>
          <TextField
            id={COLLATERAL_TOKEN_ADDRESS}
            name={COLLATERAL_TOKEN_ADDRESS}
            type='text'
            label={t('recipient')}
            placeholder={t('recipient_account')}
            ref={register({
              required: {
                value: true,
                message: t('enter_recipient_address')
              }
            })}
            error={!!errors[COLLATERAL_TOKEN_ADDRESS]}
            helperText={errors[COLLATERAL_TOKEN_ADDRESS]?.message} />
          {/* TODO: should be a drop-down */}
          <InterlayDenimOrKintsugiMidnightOutlinedButton
            style={{ display: 'flex' }}
            className={clsx(
              'ml-auto',
              'mt-2'
            )}
            startIcon={selectedNetworkItem.icon}
            onClick={handleNetworkModalOpen}>
            {selectedNetworkItem.title}
          </InterlayDenimOrKintsugiMidnightOutlinedButton>
        </div>
        <SubmitButton
          disabled={
            parachainStatus !== ParachainStatus.Running ||
            !!selectedNetworkItem.disabled
          }
          pending={submitStatus === STATUSES.PENDING}
          onClick={handleConfirmClick}>
          {accountSet ? (
            selectedNetworkItem.disabled ? t('coming_soon') : t('transfer')
          ) : (
            t('connect_wallet')
          )}
        </SubmitButton>
      </form>
      <InterlayModal
        open={networkModalOpen}
        onClose={handleNetworkModalClose}>
        <InterlayModalInnerWrapper
          className={clsx(
            'max-w-sm',
            'space-y-4'
          )}>
          <InterlayModalTitle
            as='h3'
            className={clsx(
              'text-md',
              'font-medium',
              'mb-6'
            )}>
            Select a network
          </InterlayModalTitle>
          <div className='space-y-2'>
            {NETWORK_ITEMS.map(networkItem => (
              <InterlayDefaultOutlinedButton
                key={networkItem.type}
                className='w-full'
                startIcon={networkItem.icon}
                onClick={() => {
                  setSelectedNetworkType(networkItem.type);
                  handleNetworkModalClose();
                }}>
                {networkItem.title}
              </InterlayDefaultOutlinedButton>
            ))}
          </div>
        </InterlayModalInnerWrapper>
      </InterlayModal>
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
  );
};

export default TransferForm;
