
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
  getUsdAmount
} from 'common/utils/utils';
import { parachainToUIIssueRequest } from 'common/utils/requests';
import { ReactComponent as BitcoinLogoIcon } from 'assets/img/bitcoin-logo.svg';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';
import { ACCOUNT_ID_TYPE_NAME } from '../../../constants';
import ParachainStatusInfo from 'components/ParachainStatusInfo';

enum IssueState {
  Loading,
  Resolved,
  Rejected
}

type EnterBTCForm = {
  amountPolkaBTC: string;
}

function EnterBTCAmount(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [issueState, setIssueState] = useState(IssueState.Loading);

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
  // Current fee model specification taken from: https://interlay.gitlab.io/polkabtc-spec/spec/fee.html
  const [feeRate, setFeeRate] = useState(new Big(0.005)); // set default to 0.5%
  const [fee, setFee] = useState('0');
  const [depositRate, setDepositRate] = useState(new Big(0.00005)); // set default to 0.005%
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
    // Loading this data is not strictly required as long as the constantly set values did
    // not change. However, you will not see the correct value for the security deposit.
    // But not having this data will NOT block the requestIssue
    const fetchFeeData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const [
          feeRate,
          depositRate,
          issuePeriodInBlocks,
          dustValueAsSatoshi,
          btcToDot
        ] = await Promise.all([
          window.polkaBTC.issue.getFeeRate(),
          window.polkaBTC.fee.getIssueGriefingCollateralRate(),
          window.polkaBTC.issue.getIssuePeriod(),
          window.polkaBTC.redeem.getDustValue(),
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
        // Set exchange rate
        setBtcToDotRate(btcToDot);
      } catch (error) {
        console.log('[EnterBtcAmount useEffect] error.message => ', error.message);
      }
    };

    // This data (the vaults) is strictly required to request issue
    const fetchVaultData = async () => {
      if (!polkaBtcLoaded) return;

      try {
        const vaultsMap = await window.polkaBTC.vaults.getVaultsWithIssuableTokens();
        // Set the vault maximum
        let maxVaultAmount = new BN(0);
        // first item in the ma is the vault with the largest capacity
        for (const issuableTokens of vaultsMap.values()) {
          maxVaultAmount = issuableTokens.toBn();
          break;
        }
        setVaultMaxAmount(satToBTC(maxVaultAmount.toString()));
        setVaults(vaultsMap);
        setIssueState(IssueState.Resolved);
      } catch (error) {
        console.log('[EnterBtcAmount useEffect] error.message => ', error.message);
        setIssueState(IssueState.Rejected);
      }
    };
    fetchFeeData();
    fetchVaultData();
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
      setDeposit(deposit.round(8).toString());
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

      // ray test touch <
      const issueRequest = await parachainToUIIssueRequest(requestResult.id, requestResult.issueRequest);
      // ray test touch >

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
              <div className='col-6 temp-text-left'>{t('bridge_fee')}</div>
              <div className='col fee-number'>
                <div
                  className={clsx(
                    'flex',
                    'justify-center',
                    'space-x-1'
                  )}>
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                  <span className='fee-btc'>{displayBtcAmount(fee)}</span>
                  <span>BTC</span>
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
              <div className='col-6 temp-text-left'>{t('issue_page.security_deposit')}</div>
              <div className='col fee-number'>
                <div
                  className={clsx(
                    'flex',
                    'justify-center',
                    'space-x-1'
                  )}>
                  <PolkadotLogoIcon
                    width={20}
                    height={20} />
                  <span className='fee-btc'>{deposit}</span>
                  <span>DOT</span>
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
              <div className='col-6 temp-text-left total-added-value'>{t('total_deposit')}</div>
              <div className='col fee-number'>
                <div
                  className={clsx(
                    'flex',
                    'justify-center',
                    'space-x-1'
                  )}>
                  <BitcoinLogoIcon
                    width={23}
                    height={23} />
                  <span className='fee-btc'>
                    {displayBtcAmount(amountBTC)}
                  </span>
                  <span>BTC</span>
                </div>
                <div>
                  {'~ $' + getUsdAmount(amountBTC, prices.bitcoin.usd)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ButtonMaybePending
        className='btn green-button app-btn'
        disabled={
          parachainStatus !== ParachainStatus.Running ||
          !address ||
          issueState !== IssueState.Resolved
        }
        isPending={isRequestPending}
        onClick={onSubmit}>
        {t('confirm')}
      </ButtonMaybePending>
    </form>
  );
}

export default EnterBTCAmount;
