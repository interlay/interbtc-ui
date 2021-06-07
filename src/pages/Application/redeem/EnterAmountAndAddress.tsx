
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import {
  btcToSat,
  stripHexPrefix
} from '@interlay/interbtc';

import InterBTCField from '../InterBTCField';
import PriceInfo from '../PriceInfo';
import ParachainStatusInfo from '../ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import Toggle from 'components/Toggle';
import TextField from 'components/TextField';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorModal from 'components/ErrorModal';
import ErrorHandler from 'components/ErrorHandler';
import InterlayButton from 'components/UI/InterlayButton';
import {
  changeRedeemStepAction,
  changeRedeemIdAction,
  togglePremiumRedeemAction,
  addRedeemRequestAction
} from 'common/actions/redeem.actions';
import { updateBalanceInterBTCAction } from 'common/actions/general.actions';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  BALANCE_MAX_INTEGER_LENGTH,
  BTC_ADDRESS_REGEX
} from '../../../constants';
import { BLOCKS_BEHIND_LIMIT } from 'config/parachain';
import {
  displayBtcAmount,
  getUsdAmount,
  getRandomVaultIdWithCapacity
} from 'common/utils/utils';
import { parachainToUIRedeemRequest } from 'common/utils/requests';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

const POLKA_BTC_AMOUNT = 'polka-btc-amount';
const BTC_ADDRESS = 'btc-address';

type RedeemForm = {
  [POLKA_BTC_AMOUNT]: string;
  [BTC_ADDRESS]: string;
}

const EnterAmountAndAddress = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [error, setError] = React.useState<Error | null>(null);

  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    balanceInterBTC,
    interBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);
  const premiumRedeemSelected = useSelector((state: StoreType) => state.redeem.premiumRedeem);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError
  } = useForm<RedeemForm>({
    mode: 'onChange'
  });
  const interBTCAmount = watch(POLKA_BTC_AMOUNT);

  const [dustValue, setDustValue] = React.useState('0');
  const [redeemFee, setRedeemFee] = React.useState('0');
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(0.005));
  const [btcToDotRate, setBtcToDotRate] = React.useState(new Big(0));
  const [premiumRedeemVaults, setPremiumRedeemVaults] = React.useState<Map<AccountId, Big>>(new Map());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(new Big(0));
  const [currentInclusionFee, setCurrentInclusionFee] = React.useState(new Big(0));

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!interBtcLoaded) return;
    if (!interBTCAmount) return;
    if (!redeemFeeRate) return;

    const bigInterBTCAmount = new Big(interBTCAmount);
    const theRedeemFee = bigInterBTCAmount.mul(redeemFeeRate);
    setRedeemFee(theRedeemFee.toString());
  }, [
    interBtcLoaded,
    interBTCAmount,
    redeemFeeRate
  ]);

  React.useEffect(() => {
    if (!interBtcLoaded) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          dustValueResult,
          premiumRedeemVaultsResult,
          premiumRedeemFeeResult,
          btcToDotRateResult,
          redeemFeeRateResult,
          currentInclusionFeeResult
        ] = await Promise.allSettled([
          window.interBTC.redeem.getDustValue(),
          window.interBTC.vaults.getPremiumRedeemVaults(),
          window.interBTC.redeem.getPremiumRedeemFee(),
          window.interBTC.oracle.getExchangeRate(),
          window.interBTC.redeem.getFeeRate(),
          window.interBTC.redeem.getCurrentInclusionFee()
        ]);

        if (dustValueResult.status === 'rejected') {
          throw new Error(dustValueResult.reason);
        }
        if (premiumRedeemFeeResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeResult.reason);
        }
        if (btcToDotRateResult.status === 'rejected') {
          throw new Error(btcToDotRateResult.reason);
        }
        if (redeemFeeRateResult.status === 'rejected') {
          throw new Error(redeemFeeRateResult.reason);
        }
        if (currentInclusionFeeResult.status === 'rejected') {
          throw new Error(currentInclusionFeeResult.reason);
        }
        if (premiumRedeemVaultsResult.status === 'fulfilled') {
          setPremiumRedeemVaults(premiumRedeemVaultsResult.value);
        }

        setDustValue(dustValueResult.value.toString());
        setPremiumRedeemFee(new Big(premiumRedeemFeeResult.value));
        setBtcToDotRate(btcToDotRateResult.value);
        setRedeemFeeRate(redeemFeeRateResult.value);
        setCurrentInclusionFee(currentInclusionFeeResult.value);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [interBtcLoaded]);

  if (status === STATUSES.REJECTED && error) {
    return (
      <ErrorHandler error={error} />
    );
  }

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayTreePoppy-400' />
      </div>
    );
  }

  const onSubmit = async (data: RedeemForm) => {
    try {
      setSubmitStatus(STATUSES.PENDING);
      const interBTCAmount = new Big(data[POLKA_BTC_AMOUNT]);

      // Differentiate between premium and regular redeem
      let vaultId;
      if (premiumRedeemSelected) {
        // Select a vault from the premium redeem vault list
        for (const [id, redeemableTokens] of premiumRedeemVaults) {
          if (redeemableTokens >= interBTCAmount) {
            vaultId = id;
            break;
          }
        }
        if (vaultId === undefined) {
          let maxAmount = new Big(0);
          for (const redeemableTokens of premiumRedeemVaults.values()) {
            if (maxAmount < redeemableTokens) {
              maxAmount = redeemableTokens;
            }
          }
          setFormError(POLKA_BTC_AMOUNT, {
            type: 'manual',
            message: t('redeem_page.error_max_premium_redeem', { maxPremiumRedeem: maxAmount.toString() })
          });

          return;
        }
      } else {
        const vaults = await window.interBTC.vaults.getVaultsWithRedeemableTokens();
        vaultId = getRandomVaultIdWithCapacity(Array.from(vaults || new Map()), interBTCAmount);
      }

      // FIXME: workaround to make premium redeem still possible
      const relevantVaults = new Map<AccountId, Big>();
      const id = window.interBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
      // FIXME: a bit of a dirty workaround with the capacity
      relevantVaults.set(id, interBTCAmount.mul(2));
      const result = await window.interBTC.redeem.request(interBTCAmount, data[BTC_ADDRESS], true, 0, relevantVaults);
      // TODO: handle redeem aggregator
      const redeemRequest = await parachainToUIRedeemRequest(result[0].id, result[0].redeemRequest);
      setSubmitStatus(STATUSES.RESOLVED);

      // Get the redeem id from the request redeem event
      const redeemId = stripHexPrefix(result[0].id.toString());
      dispatch(changeRedeemIdAction(redeemId));

      // Update the redeem status
      dispatch(updateBalanceInterBTCAction(new Big(balanceInterBTC).sub(new Big(data[POLKA_BTC_AMOUNT])).toString()));
      dispatch(addRedeemRequestAction(redeemRequest));
      dispatch(changeRedeemStepAction('REDEEM_INFO'));
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateInterBTCAmount = (value: number): string | undefined => {
    const bigValue = new Big(value);
    const minValue = new Big(dustValue).add(currentInclusionFee).add(new Big(redeemFee));
    if (bigValue.gt(new Big(balanceInterBTC))) {
      return `${t('redeem_page.current_balance')}${balanceInterBTC}`;
    } else if (bigValue.lte(minValue)) {
      return `${t('redeem_page.amount_greater_dust_inclusion')}${minValue} BTC).`;
    }

    if (!address) {
      return t('redeem_page.must_select_account_warning');
    }

    if (!interBtcLoaded) {
      return 'InterBTC must be loaded!';
    }

    if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
      return t('issue_page.error_more_than_6_blocks_behind');
    }

    if (btcToSat(value.toString()) === undefined) {
      return 'Invalid InterBTC amount input!';
    }

    const interBTCAmountInteger = value.toString().split('.')[0];
    if (interBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
      return 'Input value is too high!';
    }

    return undefined;
  };

  const handlePremiumRedeemToggle = () => {
    // TODO: should not use redux
    dispatch(togglePremiumRedeemAction(!premiumRedeemSelected));
  };

  const redeemFeeInBTC = displayBtcAmount(redeemFee);
  const redeemFeeInUSD = getUsdAmount(redeemFee, prices.bitcoin.usd);

  const totalBTC =
      interBTCAmount ?
        displayBtcAmount(new Big(interBTCAmount).sub(new Big(redeemFee)).sub(currentInclusionFee)) :
        '0';
  const totalBTCInUSD = getUsdAmount(totalBTC, prices.bitcoin.usd);

  const totalDOT =
    interBTCAmount ?
      new Big(interBTCAmount).mul(btcToDotRate).mul(premiumRedeemFee).toString() :
      '0';
  const totalDOTInUSD = getUsdAmount(totalDOT, prices.polkadot.usd);

  const bitcoinNetworkFeeInBTC = displayBtcAmount(currentInclusionFee);
  const bitcoinNetworkFeeInUSD = getUsdAmount(currentInclusionFee, prices.bitcoin.usd);

  if (status === STATUSES.RESOLVED) {
    return (
      <>
        <form
          className='space-y-8'
          onSubmit={handleSubmit(onSubmit)}>
          <h4
            className={clsx(
              'font-medium',
              'text-center',
              'text-interlayTreePoppy'
            )}>
            {t('redeem_page.you_will_receive')}
          </h4>
          <InterBTCField
            id='polka-btc-amount'
            name={POLKA_BTC_AMOUNT}
            type='number'
            label='InterBTC'
            step='any'
            placeholder='0.00'
            min={0}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.please_enter_amount')
              },
              validate: value => validateInterBTCAmount(value)
            })}
            approxUSD={`≈ $ ${getUsdAmount(interBTCAmount || '0', usdPrice)}`}
            error={!!errors[POLKA_BTC_AMOUNT]}
            helperText={errors[POLKA_BTC_AMOUNT]?.message} />
          <ParachainStatusInfo status={parachainStatus} />
          <TextField
            id='btc-address'
            name={BTC_ADDRESS}
            type='text'
            label='BTC Address'
            placeholder={t('enter_btc_address')}
            ref={register({
              required: {
                value: true,
                message: t('redeem_page.enter_btc')
              },
              pattern: {
                value: BTC_ADDRESS_REGEX, // TODO: regex need to depend on global mainnet | testnet parameter
                message: t('redeem_page.valid_btc_address')
              }
            })}
            error={!!errors[BTC_ADDRESS]}
            helperText={errors[BTC_ADDRESS]?.message} />
          {premiumRedeemVaults.size > 0 && (
            <div
              className={clsx(
                'flex',
                'justify-center',
                'items-center',
                'space-x-4'
              )}>
              <div
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-1'
                )}>
                <span>{t('redeem_page.premium_redeem')}</span>
                <Tooltip overlay={t('redeem_page.premium_redeem_info')}>
                  <FaExclamationCircle />
                </Tooltip>
              </div>
              <Toggle
                checked={premiumRedeemSelected}
                onChange={handlePremiumRedeemToggle} />
            </div>
          )}
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('bridge_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={redeemFeeInBTC}
            unitName='BTC'
            approxUSD={redeemFeeInUSD} />
          <PriceInfo
            title={
              <h5 className='text-textSecondary'>
                {t('bitcoin_network_fee')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={bitcoinNetworkFeeInBTC}
            unitName='BTC'
            approxUSD={bitcoinNetworkFeeInUSD} />
          <hr
            className={clsx(
              'border-t-2',
              'my-2.5',
              'border-textSecondary'
            )} />
          <PriceInfo
            title={
              <h5 className='text-textPrimary'>
                {t('you_will_receive')}
              </h5>
            }
            unitIcon={
              <BitcoinLogoIcon
                width={23}
                height={23} />
            }
            value={totalBTC}
            unitName='BTC'
            approxUSD={totalBTCInUSD} />
          {premiumRedeemSelected && (
            <PriceInfo
              title={
                <h5 className='text-interlayMalachite'>
                  {t('redeem_page.earned_premium')}
                </h5>
              }
              unitIcon={
                <PolkadotLogoIcon
                  width={23}
                  height={23} />
              }
              value={totalDOT}
              unitName='DOT'
              approxUSD={totalDOTInUSD} />
          )}
          <InterlayButton
            type='submit'
            style={{ display: 'flex' }}
            className='mx-auto'
            variant='contained'
            color='primary'
            disabled={parachainStatus !== ParachainStatus.Running}
            pending={submitStatus === STATUSES.PENDING}>
            {t('confirm')}
          </InterlayButton>
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
    );
  }

  return null;
};

export default EnterAmountAndAddress;
