
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

import InterBTCField from '../InterBTCField';
import SubmitButton from '../SubmitButton';
import TextField from 'components/TextField';
import InterlayModal, {
  InterlayModalTitle,
  InterlayModalInnerWrapper
} from 'components/UI/InterlayModal';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import ErrorModal from 'components/ErrorModal';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN
} from 'config/relay-chains';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import {
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import { showAccountModalAction } from 'common/actions/general.actions';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as InterBTCLogoIcon } from 'assets/img/interbtc-logo.svg';
import { ReactComponent as AcalaLogoIcon } from 'assets/img/acala-logo.svg';
import { ReactComponent as PlasmLogoIcon } from 'assets/img/plasm-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'assets/img/ethereum-logo.svg';
import { ReactComponent as CosmosLogoIcon } from 'assets/img/cosmos-logo.svg';

const WRAPPED_TOKEN_INPUT_AMOUNT = 'wrapped-token-input-amount';
const DOT_ADDRESS = 'dot-address';

type TransferFormData = {
  [WRAPPED_TOKEN_INPUT_AMOUNT]: string;
  [DOT_ADDRESS]: string;
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
      <InterBTCLogoIcon
        width={24}
        height={19.05} />
    ),
    title: 'interBTC'
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

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
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
    watch,
    reset
  } = useForm<TransferFormData>({
    mode: 'onChange'
  });
  const wrappedTokenAmount = watch(WRAPPED_TOKEN_INPUT_AMOUNT);

  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);
  const [selectedNetworkType, setSelectedNetworkType] = React.useState(NETWORK_TYPES.INTER_BTC);

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
        data[DOT_ADDRESS],
        newMonetaryAmount(data[WRAPPED_TOKEN_INPUT_AMOUNT], WRAPPED_TOKEN, true)
      );
      setSubmitStatus(STATUSES.RESOLVED);
      toast.success(t('transfer_page.successfully_transferred'));
      reset({
        [WRAPPED_TOKEN_INPUT_AMOUNT]: '',
        [DOT_ADDRESS]: ''
      });
    } catch (error) {
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
      return t('insufficient_funds_dot');
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

  return (
    <>
      <form
        className='space-y-8'
        onSubmit={handleSubmit(onSubmit)}>
        <h4
          className={clsx(
            'font-medium',
            'text-center',
            'text-interlayDenim'
          )}>
          {t('transfer_page.transfer_interbtc')}
        </h4>
        <InterBTCField
          id={WRAPPED_TOKEN_INPUT_AMOUNT}
          name={WRAPPED_TOKEN_INPUT_AMOUNT}
          type='number'
          label='interBTC'
          step='any'
          placeholder='0.00'
          ref={register({
            required: {
              value: true,
              message: t('redeem_page.please_enter_amount')
            },
            validate: value => validateForm(value)
          })}
          approxUSD={`≈ $ ${getUsdAmount(BitcoinAmount.from.BTC(wrappedTokenAmount || '0.00'), usdPrice)}`}
          error={!!errors[WRAPPED_TOKEN_INPUT_AMOUNT]}
          helperText={errors[WRAPPED_TOKEN_INPUT_AMOUNT]?.message} />
        <div>
          <TextField
            id='dot-address'
            name={DOT_ADDRESS}
            type='text'
            label={t('recipient')}
            placeholder={t('recipient_account')}
            ref={register({
              required: {
                value: true,
                message: t('enter_recipient_address')
              }
            })}
            error={!!errors[DOT_ADDRESS]}
            helperText={errors[DOT_ADDRESS]?.message} />
          {/* TODO: should be a drop-down */}
          <InterlayDenimOutlinedButton
            style={{ display: 'flex' }}
            className={clsx(
              'ml-auto',
              'mt-2'
            )}
            startIcon={selectedNetworkItem.icon}
            onClick={handleNetworkModalOpen}>
            {selectedNetworkItem.title}
          </InterlayDenimOutlinedButton>
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
              'font-medium'
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
