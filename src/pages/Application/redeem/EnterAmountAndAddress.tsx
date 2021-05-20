
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Big from 'big.js';
import BN from 'bn.js';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import {
  btcToSat,
  satToBTC,
  stripHexPrefix
} from '@interlay/polkabtc';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces';

import PolkaBTCField from '../PolkaBTCField';
import PriceInfo from '../PriceInfo';
import ParachainStatusInfo from '../ParachainStatusInfo';
import Tooltip from 'components/Tooltip';
import Toggle from 'components/Toggle';
import TextField from 'components/TextField';
import EllipsisLoader from 'components/EllipsisLoader';
import ErrorHandler from 'components/ErrorHandler';
import InterlayButton from 'components/UI/InterlayButton';
import {
  changeRedeemStepAction,
  changeRedeemIdAction,
  togglePremiumRedeemAction,
  addRedeemRequestAction
} from 'common/actions/redeem.actions';
import { updateBalancePolkaBTCAction } from 'common/actions/general.actions';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  BALANCE_MAX_INTEGER_LENGTH,
  BTC_ADDRESS_REGEX
} from '../../../constants';
import { BLOCKS_BEHIND_LIMIT } from 'config/parachain';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  displayBtcAmount,
  getUsdAmount
} from 'common/utils/utils';
import { parachainToUIRedeemRequest } from 'common/utils/requests';
import STATUSES from 'utils/constants/statuses';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

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
    balancePolkaBTC,
    polkaBtcLoaded,
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
  const polkaBTCAmount = watch(POLKA_BTC_AMOUNT);

  const [dustValue, setDustValue] = React.useState('0');
  const [redeemFee, setRedeemFee] = React.useState('0');
  const [redeemFeeRate, setRedeemFeeRate] = React.useState(new Big(0.005));
  const [btcToDotRate, setBtcToDotRate] = React.useState(new Big(0));
  const [premiumRedeemVaults, setPremiumRedeemVaults] = React.useState<Map<AccountId, PolkaBTC>>(new Map());
  const [premiumRedeemFee, setPremiumRedeemFee] = React.useState(new Big(0));

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!polkaBTCAmount) return;
    if (!redeemFeeRate) return;

    const bigPolkaBTCAmount = new Big(polkaBTCAmount);
    const theRedeemFee = bigPolkaBTCAmount.mul(redeemFeeRate);
    setRedeemFee(theRedeemFee.toString());
  }, [
    polkaBtcLoaded,
    polkaBTCAmount,
    redeemFeeRate
  ]);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const [
          dustValueInSatoshiResult,
          premiumRedeemVaultsResult,
          premiumRedeemFeeResult,
          btcToDotRateResult,
          theRedeemFeeRateResult
        ] = await Promise.allSettled([
          window.polkaBTC.redeem.getDustValue(),
          window.polkaBTC.vaults.getPremiumRedeemVaults(),
          window.polkaBTC.redeem.getPremiumRedeemFee(),
          window.polkaBTC.oracle.getExchangeRate(),
          window.polkaBTC.redeem.getFeeRate()
        ]);

        if (dustValueInSatoshiResult.status === 'rejected') {
          throw new Error(dustValueInSatoshiResult.reason);
        }
        if (premiumRedeemFeeResult.status === 'rejected') {
          throw new Error(premiumRedeemFeeResult.reason);
        }
        if (btcToDotRateResult.status === 'rejected') {
          throw new Error(btcToDotRateResult.reason);
        }
        if (theRedeemFeeRateResult.status === 'rejected') {
          throw new Error(theRedeemFeeRateResult.reason);
        }
        if (premiumRedeemVaultsResult.status === 'fulfilled') {
          setPremiumRedeemVaults(premiumRedeemVaultsResult.value);
        }

        const theDustValue = satToBTC(dustValueInSatoshiResult.value.toString());
        setDustValue(theDustValue);
        setPremiumRedeemFee(new Big(premiumRedeemFeeResult.value));
        setBtcToDotRate(btcToDotRateResult.value);
        setRedeemFeeRate(theRedeemFeeRateResult.value);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [polkaBtcLoaded]);

  if (status === STATUSES.REJECTED && error) {
    return (
      <ErrorHandler error={error} />
    );
  }
  if (submitStatus === STATUSES.REJECTED && submitError) {
    return (
      <ErrorHandler error={submitError} />
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
      const polkaBTCAmountInSatoshi = btcToSat(data[POLKA_BTC_AMOUNT]);
      const amountInSatoshi = window.polkaBTC.api.createType('Balance', polkaBTCAmountInSatoshi);

      // Differentiate between premium and regular redeem
      let vaultId;
      if (premiumRedeemSelected) {
        // Select a vault from the premium redeem vault list
        for (const [id, redeemableTokens] of premiumRedeemVaults) {
          const redeemable = redeemableTokens.toBn();
          if (redeemable.gte(new BN(polkaBTCAmountInSatoshi))) {
            vaultId = id;
            break;
          }
        }
        if (vaultId === undefined) {
          let maxAmount = new BN(0);
          for (const redeemableTokens of premiumRedeemVaults.values()) {
            const redeemable = redeemableTokens.toBn();
            if (maxAmount.lt(redeemable)) {
              maxAmount = redeemable;
            }
          }
          const maxPremiumRedeem = satToBTC(maxAmount.toString());
          setFormError(POLKA_BTC_AMOUNT, {
            type: 'manual',
            message: t('redeem_page.error_max_premium_redeem', { maxPremiumRedeem: maxPremiumRedeem.toString() })
          });

          return;
        }
      } else {
        // Select a random vault
        // TODO: should use a list of vaults directly from the parachain
        vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountInSatoshi);
      }

      const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId.toString());
      const result = await window.polkaBTC.redeem.request(amountInSatoshi, data[BTC_ADDRESS], vaultAccountId);
      const redeemRequest = await parachainToUIRedeemRequest(result.id);
      setSubmitStatus(STATUSES.RESOLVED);

      // Get the redeem id from the request redeem event
      const redeemId = stripHexPrefix(result.id.toString());
      dispatch(changeRedeemIdAction(redeemId));

      // Update the redeem status
      dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(data[POLKA_BTC_AMOUNT])).toString()));
      dispatch(addRedeemRequestAction(redeemRequest));
      dispatch(changeRedeemStepAction('REDEEM_INFO'));
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validatePolkaBTCAmount = (value: number): string | undefined => {
    // TODO: should be `big` type other than `Number`
    if (value > Number(balancePolkaBTC)) {
      return `${t('redeem_page.current_balance')}${balancePolkaBTC}`;
    } else if (value < Number(dustValue)) {
      return `${t('redeem_page.amount_greater')}${dustValue}BTC).`;
    }

    if (!address) {
      return t('redeem_page.must_select_account_warning');
    }

    if (!polkaBtcLoaded) {
      return 'PolkaBTC must be loaded!';
    }

    if (bitcoinHeight - btcRelayHeight > BLOCKS_BEHIND_LIMIT) {
      return t('issue_page.error_more_than_6_blocks_behind');
    }

    const polkaBTCAmountInSatoshi = btcToSat(value.toString());
    if (polkaBTCAmountInSatoshi === undefined) {
      return 'Invalid PolkaBTC amount input!';
    }

    const polkaBTCAmountInteger = value.toString().split('.')[0];
    if (polkaBTCAmountInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
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
      polkaBTCAmount ?
        new Big(polkaBTCAmount).sub(new Big(redeemFee)).round(8).toString() :
        '0';
  const totalBTCInUSD = getUsdAmount(totalBTC, prices.bitcoin.usd);

  const totalDOT =
    polkaBTCAmount ?
      new Big(polkaBTCAmount).mul(btcToDotRate).mul(premiumRedeemFee).toString() :
      '0';
  const totalDOTInUSD = getUsdAmount(totalDOT, prices.polkadot.usd);

  if (status === STATUSES.RESOLVED) {
    return (
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
        <PolkaBTCField
          id='polka-btc-amount'
          name={POLKA_BTC_AMOUNT}
          type='number'
          label='PolkaBTC'
          step='any'
          placeholder='0.00'
          min={0}
          ref={register({
            required: {
              value: true,
              message: t('redeem_page.please_enter_amount')
            },
            validate: value => validatePolkaBTCAmount(value)
          })}
          approxUSD={`≈ $ ${getUsdAmount(polkaBTCAmount || '0', usdPrice)}`}
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
          className='mx-auto'
          variant='contained'
          color='primary'
          disabled={parachainStatus !== ParachainStatus.Running}
          pending={submitStatus === STATUSES.PENDING}>
          {t('confirm')}
        </InterlayButton>
      </form>
    );
  }

  return null;
};

export default EnterAmountAndAddress;
