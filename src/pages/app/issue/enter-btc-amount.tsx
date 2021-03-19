
import {
  useState,
  useEffect
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import BN from 'bn.js';
import Big from 'big.js';
import { PolkaBTC } from '@interlay/polkabtc/build/interfaces/default';
import clsx from 'clsx';

import ButtonMaybePending from 'common/components/pending-button';
import {
  ParachainStatus,
  StoreType
} from 'common/types/util.types';
import * as constants from '../../../constants';
import {
  changeIssueStepAction,
  changeIssueIdAction,
  addIssueRequestAction,
  updateIssuePeriodAction
} from 'common/actions/issue.actions';
import {
  btcToSat,
  satToBTC,
  stripHexPrefix
} from '@interlay/polkabtc';
import {
  displayBtcAmount,
  getRandomVaultIdWithCapacity,
  getUsdAmount,
  parachainToUIIssueRequest
} from 'common/utils/utils';
import bitcoinLogo from 'assets/img/small-bitcoin-logo.png';
import polkadotLogo from 'assets/img/small-polkadot-logo.png';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';
import ParachainStatusInfo from 'components/ParachainStatusInfo';

type EnterBTCForm = {
  amountPolkaBTC: string;
}

function EnterBTCAmount() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    polkaBtcLoaded,
    address,
    bitcoinHeight,
    btcRelayHeight,
    prices,
    parachainStatus
  } = useSelector((state: StoreType) => state.general);

  // Form
  const [amountPolkaBTC, setAmountPolkaBTC] = useState('');
  const defaultValues = amountPolkaBTC ? { defaultValues: { amountPolkaBTC: amountPolkaBTC } } : undefined;
  const {
    register,
    handleSubmit,
    errors,
    getValues
  } = useForm<EnterBTCForm>(defaultValues);

  // Additional info: bridge fee, security deposit, amount BTC
  const [feeRate, setFeeRate] = useState(new Big(0));
  const [fee, setFee] = useState('0');
  const [depositRate, setDepositRate] = useState(new Big(0));
  const [deposit, setDeposit] = useState('0');
  const [amountBTC, setAmountBTC] = useState('0');
  const [btcToDotRate, setBtcToDotRate] = useState(new Big(0));

  // Vault selection
  const [vaults, setVaults] = useState(new Map());
  const [vaultId, setVaultId] = useState('');

  // Form validation
  const [dustValue, setDustValue] = useState('0');
  const [vaultMaxAmount, setVaultMaxAmount] = useState('');

  // Request status
  const [isRequestPending, setRequestPending] = useState(false);

  // Load issue related data
  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const [
          feeRate,
          depositRate,
          issuePeriodInBlocks,
          dustValueAsSatoshi,
          vaultsMap,
          btcToDot
        ] = await Promise.all([
          window.polkaBTC.issue.getFeeRate(),
          window.polkaBTC.fee.getIssueGriefingCollateralRate(),
          window.polkaBTC.issue.getIssuePeriod(),
          window.polkaBTC.redeem.getDustValue(),
          window.polkaBTC.vaults.getVaultsWithIssuableTokens(),
          window.polkaBTC.oracle.getExchangeRate()
        ]);
        // Set bridge fee rate
        setFeeRate(feeRate);
        // Set deposit rate
        setDepositRate(depositRate);
        // Set issue period
        const issuePeriod = new BN(issuePeriodInBlocks.toString()).mul(new BN(constants.BLOCK_TIME)).toNumber();
        dispatch(updateIssuePeriodAction(issuePeriod));
        // Set dust value (minimum amount)
        const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
        setDustValue(dustValueBtc);
        // Set the vault maximum
        let maxVaultAmount = new BN(0);
        for (const issuableTokens of vaultsMap.values()) {
          maxVaultAmount = issuableTokens.toBn();
          break;
        }
        setVaultMaxAmount(satToBTC(maxVaultAmount.toString()));
        setVaults(vaultsMap);
        // Set exchange rate
        setBtcToDotRate(btcToDot);
      } catch (error) {
        console.log('[EnterBtcAmount useEffect] error.message => ', error.message);
      }
    };
    fetchData();
  }, [
    polkaBtcLoaded,
    dispatch
  ]);

  // Update form
  const onValueChange = async () => {
    const value = getValues('amountPolkaBTC');

    try {
      // Update form input
      setAmountPolkaBTC(value);
      // Update bridge fee
      const amountPolkaBTC = new Big(value);
      const fee = amountPolkaBTC.mul(feeRate);
      setFee(fee.toString());
      // Update security deposit
      const deposit = amountPolkaBTC.mul(btcToDotRate).mul(depositRate);
      setDeposit(deposit.toString());
      // Update total BTC
      const amountBTC = amountPolkaBTC.add(fee);
      setAmountBTC(amountBTC.toString());

      // Select vault
      const amountSAT = btcToSat(value);
      const vaultId = getRandomVaultIdWithCapacity(Array.from(vaults), new BN(amountSAT));
      if (vaultId) {
        setVaultId(vaultId);
      } else {
        setVaultId('');
      }
    } catch (error) {
      console.log('[EnterBTCAmount onValueChange] error.message => ', error.message);
    }
  };

  // Form validation
  const validateAmount = (value: number): string | undefined => {
    if (!vaultId) {
      return t('issue_page.maximum_in_single_request', {
        maxAmount: parseFloat(Number(vaultMaxAmount).toFixed(5))
      });
    }
    if (value > 1) {
      return t('issue_page.validation_max_value');
    }
    if (value < Number(dustValue)) {
      return t('issue_page.validation_min_value') + dustValue + 'BTC).';
    }

    return undefined;
  };

  // Request issue
  const onSubmit = handleSubmit(async ({ amountPolkaBTC }) => {
    if (!polkaBtcLoaded || !vaultId) return;

    if (bitcoinHeight - btcRelayHeight > constants.BLOCKS_BEHIND_LIMIT) {
      toast.error(t('issue_page.error_more_than_6_blocks_behind'));
      return;
    }

    setRequestPending(true);
    try {
      const amountSAT = btcToSat(amountPolkaBTC);
      if (amountSAT === undefined) {
        throw new Error('Invalid BTC amount input.');
      }

      const amountAsSatoshi = window.polkaBTC.api.createType('Balance', amountSAT);
      const vaultAccountId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, vaultId);
      const requestResult = await window.polkaBTC.issue.request(amountAsSatoshi as PolkaBTC, vaultAccountId);

      // get the issue id from the request issue event
      const id = stripHexPrefix(requestResult.id.toString());
      dispatch(changeIssueIdAction(id));

      const issueRequest = await parachainToUIIssueRequest(requestResult.id, requestResult.issueRequest);

      // update the issue status
      dispatch(addIssueRequestAction(issueRequest));
      dispatch(changeIssueStepAction('BTC_PAYMENT'));
    } catch (error) {
      toast.error(error.toString());
    }
    setRequestPending(false);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className='row'>
        <div
          className={clsx(
            'col-12 wizard-header-text',
            'text-interlayPink'
          )}>
          {t('issue_page.mint_polka_by_wrapping')}
        </div>
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
            onChange={onValueChange}
            min='0'
            ref={register({
              required: true,
              validate: value => {
                return validateAmount(value);
              }
            })} />
        </div>
        <div className='col-6 mark-currency'>PolkaBTC</div>
      </div>
      <div className='row usd-price'>
        <div className='col'>{'~ $' + getUsdAmount(amountPolkaBTC || '0', prices.bitcoin.usd)}</div>
      </div>
      {errors.amountPolkaBTC && (
        <div className='wizard-input-error'>
          {errors.amountPolkaBTC.type === 'required' ?
            t('issue_page.enter_valid_amount') :
            errors.amountPolkaBTC.message}
        </div>
      )}
      <ParachainStatusInfo status={parachainStatus} />
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border'>
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
                  <span className='fee-btc'>{displayBtcAmount(fee)}</span> BTC
                </div>
                <div>{'~ $' + getUsdAmount(fee, prices.bitcoin.usd)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border'>
            <div className='row'>
              <div className='col-6 text-left'>{t('issue_page.security_deposit')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={polkadotLogo}
                    width='20px'
                    height='20px'
                    style={{ marginRight: '5px' }}
                    alt='polkadot logo'>
                  </img>
                  <span className='fee-btc'>{deposit}</span> DOT
                </div>
                <div>{'~ $' + getUsdAmount(deposit, prices.polkadot.usd)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10 horizontal-line-total'></div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-10'>
          <div className='wizard-item wizard-item-remove-border '>
            <div className='row justify-content-center'>
              <div className='col-6 text-left total-added-value'>{t('total_deposit')}</div>
              <div className='col fee-number'>
                <div>
                  <img
                    src={bitcoinLogo}
                    width='23px'
                    height='23px'
                    alt='bitcoin logo'>
                  </img>
                  &nbsp;&nbsp;
                  <span className='fee-btc'>
                    {displayBtcAmount(amountBTC)}
                  </span>{' '}
                  BTC
                </div>
                <div>
                  {'~ $' +
                    getUsdAmount(amountBTC, prices.bitcoin.usd)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ButtonMaybePending
        className='btn green-button app-btn'
        disabled={parachainStatus !== ParachainStatus.Running || !address}
        isPending={isRequestPending}
        onClick={onSubmit}>
        {t('confirm')}
      </ButtonMaybePending>
    </form>
  );
}

export default EnterBTCAmount;
