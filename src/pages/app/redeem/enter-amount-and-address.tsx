
import {
  useState,
  useEffect,
  ReactElement
} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { useTranslation } from 'react-i18next';
import {
  btcToSat,
  satToBTC,
  stripHexPrefix
} from '@interlay/polkabtc';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces';
import { AccountId } from '@polkadot/types/interfaces/runtime';
import Big from 'big.js';
import BigNum from 'bn.js';

import ButtonMaybePending from 'common/components/pending-button';
import {
  changeRedeemStepAction,
  changeRedeemIdAction,
  togglePremiumRedeemAction,
  addRedeemRequestAction
} from 'common/actions/redeem.actions';
import { updateBalancePolkaBTCAction } from 'common/actions/general.actions';
import { StoreType } from 'common/types/util.types';
import {
  BALANCE_MAX_INTEGER_LENGTH,
  BTC_ADDRESS_REGEX
} from '../../../constants';
import * as constants from '../../../constants';
import {
  displayBtcAmount,
  getUsdAmount,
  parachainToUIRedeemRequest
} from 'common/utils/utils';
import bitcoinLogo from 'assets/img/small-bitcoin-logo.png';
import polkadotLogo from 'assets/img/small-polkadot-logo.png';

type AmountAndAddressForm = {
  amountPolkaBTC: string;
  btcAddress: string;
}

type PremiumRedeemVault = Map<AccountId, PolkaBTC>;

function EnterAmountAndAddress(): ReactElement {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
  const {
    balancePolkaBTC,
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices
  } = useSelector((state: StoreType) => state.general);

  // General redeem
  const [amountPolkaBTC, setAmountPolkaBTC] = useState('');
  const premiumRedeem = useSelector((state: StoreType) => state.redeem.premiumRedeem);
  const defaultValues = amountPolkaBTC ?
    { defaultValues: { amountPolkaBTC: amountPolkaBTC, btcAddress: '' } } :
    undefined;
  const { register, handleSubmit, errors, getValues } = useForm<AmountAndAddressForm>(defaultValues);
  const [isRequestPending, setRequestPending] = useState(false);
  const [dustValue, setDustValue] = useState('0');
  const [usdAmount, setUsdAmount] = useState('');
  const [redeemFee, setRedeemFee] = useState('0');

  // Premium redeem
  const [btcToDotRate, setBtcToDotRate] = useState(new Big(0));
  const [maxPremiumRedeem, setMaxPremiumRedeem] = useState(new Big(0));
  const [premiumRedeemVaults, setPremiumRedeemVaults] = useState(new Map() as PremiumRedeemVault);
  const [premiumRedeemFee, setPremiumRedeemFee] = useState(new Big(0));

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
        const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
        setDustValue(dustValueBtc);
      } catch (error) {
        console.log(error);
      }

      // Check if vaults below the premium redeem limit are in the system
      try {
        const premiumRedeemVaults = await window.polkaBTC.vaults.getPremiumRedeemVaults();
        setPremiumRedeemVaults(premiumRedeemVaults);

        const [premiumRedeemFee, btcToDot] = await Promise.all([
          window.polkaBTC.redeem.getPremiumRedeemFee(),
          window.polkaBTC.oracle.getExchangeRate()
        ]);
        setPremiumRedeemFee(new Big(premiumRedeemFee));
        setBtcToDotRate(btcToDot);
      } catch (e) {
        console.log(e);
      }
    };
    setUsdAmount(getUsdAmount(amountPolkaBTC || getValues('amountPolkaBTC') || '0', usdPrice));
    fetchData();
  }, [
    polkaBtcLoaded,
    getValues,
    usdPrice,
    amountPolkaBTC
  ]);

  const onSubmit = handleSubmit(async ({ amountPolkaBTC, btcAddress }) => {
    if (!polkaBtcLoaded) return;

    if (!address) {
      toast.warning(t('issue_page.must_select_account_warning'));
      return;
    }

    if (bitcoinHeight - btcRelayHeight > constants.BLOCKS_BEHIND_LIMIT) {
      toast.error(t('issue_page.error_more_than_6_blocks_behind'));
      return;
    }

    setRequestPending(true);
    try {
      const amountPolkaSAT = btcToSat(amountPolkaBTC);
      if (amountPolkaSAT === undefined) {
        throw new Error('Invalid PolkaBTC amount input');
      }
      const amountPolkaBTCInteger = amountPolkaBTC.split('.')[0];
      if (amountPolkaBTCInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
        throw new Error('Input value is too high');
      }
      const amountAsSatoshi = window.polkaBTC.api.createType('Balance', amountPolkaSAT);

      // Differentiate between premium and regular redeem
      let vaultId;
      if (premiumRedeem) {
        // Select a vault from the premium redeem vault list
        for (const [id, redeemableTokens] of premiumRedeemVaults) {
          const redeemable = redeemableTokens.toBn();
          if (redeemable.gte(new BigNum(amountPolkaSAT))) {
            vaultId = id;
            break;
          }
        }
        if (vaultId === undefined) {
          throw new Error(
            t('redeem_page.error_max_premium_redeem', { maxPremiumRedeem: maxPremiumRedeem.toString() })
          );
        }
      } else {
        // Select a random vault
        // TODO: use a list of vaults directly from the parachain
        vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
      }
      const amount = window.polkaBTC.api.createType('Balance', amountPolkaSAT);
      const vaultAccountId = window.polkaBTC.api.createType('AccountId', vaultId.toString());
      const requestResult = await window.polkaBTC.redeem.request(amount, btcAddress, vaultAccountId);

      // Get the redeem id from the request redeem event
      const id = stripHexPrefix(requestResult.id.toString());
      dispatch(changeRedeemIdAction(id));

      const redeemRequest = await parachainToUIRedeemRequest(requestResult.id);

      // Update the redeem status
      dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC)).toString()));
      dispatch(addRedeemRequestAction(redeemRequest));
      dispatch(changeRedeemStepAction('REDEEM_INFO'));
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  const calculateTotalBTC = (): string => {
    const amount = getValues('amountPolkaBTC') || '0';
    if (amount === '0') return '0';
    return new Big(amount).sub(new Big(redeemFee)).round(8).toString();
  };

  const calculateTotalDOT = (): string => {
    const amount = getValues('amountPolkaBTC') || '0';
    if (amount === '0') return '0';
    return new Big(amount).mul(btcToDotRate).mul(premiumRedeemFee).toString();
  };

  const onAmountChange = async () => {
    const amount = getValues('amountPolkaBTC') || '0';
    setAmountPolkaBTC(amount);
    setUsdAmount(getUsdAmount(amount, usdPrice));
    const fee = await window.polkaBTC.redeem.getFeesToPay(amount);
    setRedeemFee(fee);
  };

  const checkAddress = () => {
    if (!address) {
      toast.warning(t('redeem_page.must_select_account_warning'));
      return;
    }
  };

  const togglePremium = () => {
    if (!premiumRedeem) {
      let maxAmount = new BigNum(0);
      for (const redeemableTokens of premiumRedeemVaults.values()) {
        const redeemable = redeemableTokens.toBn();
        if (maxAmount.lt(redeemable)) {
          maxAmount = redeemable;
        }
      }
      const maxBtc = satToBTC(maxAmount.toString());
      setMaxPremiumRedeem(new Big(maxBtc));
    }
    dispatch(togglePremiumRedeemAction(!premiumRedeem));
  };

  return (
    <form
      className='enter-amount-and-address'
      onSubmit={onSubmit}>
      <div className='row'>
        <div className='col-12 wizard-header-text font-yellow'>{t('redeem_page.you_will_receive')}</div>
      </div>
      <div className='row'>
        <div className='col-6'>
          <input
            id='amount-btc-input'
            name='amountPolkaBTC'
            type='number'
            step='any'
            placeholder='0.00'
            className={'' + (errors.amountPolkaBTC ? ' error-borders' : '')}
            onChange={onAmountChange}
            ref={register({
              required: true,
              validate: value =>
                value > balancePolkaBTC ?
                  t('redeem_page.current_balance') + balancePolkaBTC :
                  value < Number(dustValue) ?
                    t('redeem_page.amount_greater') + dustValue + 'BTC).' :
                    undefined
            })} />
        </div>
        <div className='col-6 mark-currency'>PolkaBTC</div>
      </div>
      <div className='row usd-price'>
        <div className='col'>{'~ $' + usdAmount}</div>
      </div>
      {errors.amountPolkaBTC && (
        <div className='wizard-input-error'>
          {errors.amountPolkaBTC.type === 'required' ?
            t('redeem_page.please_enter_amount') :
            errors.amountPolkaBTC.message}
        </div>
      )}
      <div className='row'>
        <div className='col-12'>
          <p className='form-heading'>BTC destination address</p>
          <div className='input-address-wrapper'>
            <input
              id='btc-address-input'
              name='btcAddress'
              type='string'
              placeholder={t('enter_btc_address')}
              className={'' + (errors.btcAddress ? ' error-borders' : '')}
              ref={register({
                required: true,
                pattern: {
                  // FIXME: regex need to depend on global mainnet | testnet parameter
                  value: BTC_ADDRESS_REGEX,
                  message: t('redeem_page.valid_btc_address')
                }
              })} />
          </div>
        </div>
      </div>
      {errors.btcAddress && (
        <div className='address-input-error'>
          {errors.btcAddress.type === 'required' ? t('redeem_page.enter_btc') : errors.btcAddress.message}
        </div>
      )}
      {premiumRedeemVaults.size > 0 && (
        <div className='row justify-content-center'>
          <div className='col-9 premium-toggler'>
            <div className='premium-text'>
              {t('redeem_page.premium_redeem')} &nbsp;<i className='fas fa-exclamation-circle'></i>
            </div>
            <Toggle
              className='premium-toggle'
              defaultChecked={premiumRedeem}
              icons={false}
              onChange={togglePremium}>
            </Toggle>
          </div>
        </div>
      )}
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border mt-4'>
            <div className='row'>
              <div className='col-6 text-left'>{t('bridge_fee')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={bitcoinLogo}
                    width='23px'
                    height='23px'
                    alt='bitcoin logo'>
                  </img> &nbsp;
                  <span className='fee-btc'>{displayBtcAmount(redeemFee)}</span> BTC
                </div>
                <div>{'~ $' + getUsdAmount(redeemFee, prices.bitcoin.usd)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Bitcoin network fee */}
      {/* <div className="row">
        <div className="col-12">
          <div className="wizard-item">
            <div className="row">
              <div className="col-6 text-left">
                {t("bitcoin_network_fee")}
              </div>
              <div className="col-6">
                <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>BTC
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='row justify-content-center'>
        <div className='col-10 horizontal-line-total'></div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border'>
            <div className='row'>
              <div className='col-6 text-left total-added-value'>{t('you_will_receive')}</div>
              <div className='col-6'>
                <img
                  src={bitcoinLogo}
                  width='23px'
                  height='23px'
                  alt='bitcoin logo'>
                </img> &nbsp;&nbsp;
                {calculateTotalBTC()} BTC
                <div className='send-price'>
                  {'~ $' + getUsdAmount(calculateTotalBTC(), prices.bitcoin.usd)}
                </div>
              </div>
            </div>
            {premiumRedeem && (
              <div className='row mt-4'>
                <div className='col-6 text-left green-text'>{t('redeem_page.earned_premium')}</div>
                <div className='col-6'>
                  <img
                    src={polkadotLogo}
                    width='23px'
                    height='23px'
                    alt='polkadot logo'>
                  </img> &nbsp;
                  {calculateTotalDOT()} DOT
                  <div className='send-price'>
                    {'~ $' + getUsdAmount(calculateTotalDOT(), prices.bitcoin.usd)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ButtonMaybePending
        type='submit'
        className='btn green-button app-btn'
        isPending={isRequestPending}
        onClick={checkAddress}>
        {t('confirm')}
      </ButtonMaybePending>
    </form>
  );
}

export default EnterAmountAndAddress;
