
import * as React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  FaExternalLinkAlt
} from 'react-icons/fa';
import {
  BitcoinAmount,
  Polkadot,
  PolkadotAmount
} from '@interlay/monetary-js';
import { Redeem } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import PriceInfo from 'pages/Bridge/PriceInfo';
import InterlayLink from 'components/UI/InterlayLink';
import { getUsdAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ReactComponent as PolkadotLogoIcon } from 'assets/img/polkadot-logo.svg';

interface Props {
  request: Redeem;
}

const ReimbursedRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [burnedBTCAmount, setBurnedBTCAmount] = React.useState(BitcoinAmount.zero);
  const [punishmentDOTAmount, setPunishmentDOTAmount] = React.useState(PolkadotAmount.zero);
  const [burnDOTAmount, setBurnDOTAmount] = React.useState(PolkadotAmount.zero);
  const [dotAmount, setDOTAmount] = React.useState(PolkadotAmount.zero);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!request) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [
          punishmentFee,
          btcDotRate
        ] = await Promise.all([
          window.polkaBTC.interBtcApi.vaults.getPunishmentFee(),
          window.polkaBTC.interBtcApi.oracle.getExchangeRate(Polkadot)
        ]);

        const burnedBTCAmount = request ?
          request.amountBTC.add(request.bridgeFee) :
          BitcoinAmount.zero;
        const theBurnDOTAmount = btcDotRate.toCounter(burnedBTCAmount);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        const theDOTAmount = theBurnDOTAmount.add(thePunishmentDOTAmount);
        setBurnedBTCAmount(burnedBTCAmount);
        setPunishmentDOTAmount(thePunishmentDOTAmount);
        setBurnDOTAmount(theBurnDOTAmount);
        setPunishmentDOTAmount(thePunishmentDOTAmount);
        setDOTAmount(theDOTAmount);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[ReimbursedRedeemRequest useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    polkaBtcLoaded
  ]);

  return (
    <RequestWrapper>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayConifer'
        )}>
        {t('redeem_page.reimburse_success')}
      </h2>
      <p className='w-full'>
        {t('redeem_page.burn_notice')}
      </p>
      <p className='font-medium'>
        <span className='text-interlayCinnabar'>
          {`${burnedBTCAmount.toHuman()} interBTC`}
        </span>
        <span>
          &nbsp;{`(≈ $${getUsdAmount(burnedBTCAmount, prices.bitcoin.usd)})`}
        </span>
        <span className='text-interlayCinnabar'>
          &nbsp;{t('redeem_page.reimbursed').toLowerCase()}
        </span>
        .
      </p>
      <p className='font-medium'>
        <span className='text-interlayDenim'>{t('redeem_page.recover_receive_dot')}</span>
        <span className='text-interlayDenim'>
          &nbsp;{`${dotAmount.toHuman()} DOT`}
        </span>
        <span>
          &nbsp;{`(≈ $${getUsdAmount(dotAmount, prices.polkadot.usd)})`}
        </span>
        <span className='text-interlayDenim'>
          &nbsp;{t('redeem_page.recover_receive_total')}
        </span>
        .
      </p>
      <div className='w-full'>
        <PriceInfo
          className='w-full'
          title={
            <h5 className='text-textSecondary'>
              {t('redeem_page.compensation_burn')}
            </h5>
          }
          unitIcon={
            <PolkadotLogoIcon
              width={20}
              height={20} />
          }
          value={burnDOTAmount.toHuman()}
          unitName='DOT'
          approxUSD={getUsdAmount(burnDOTAmount, prices.polkadot.usd)} />
        <PriceInfo
          className='w-full'
          title={
            <h5 className='text-textSecondary'>
              {t('redeem_page.compensation_payment')}
            </h5>
          }
          unitIcon={
            <PolkadotLogoIcon
              width={20}
              height={20} />
          }
          value={punishmentDOTAmount.toHuman()}
          unitName='DOT'
          approxUSD={getUsdAmount(punishmentDOTAmount, prices.polkadot.usd)} />
        <hr
          className={clsx(
            'border-t-2',
            'my-2.5',
            'border-textSecondary'
          )} />
        <PriceInfo
          className='w-full'
          title={
            <h5 className='text-textSecondary'>
              {t('you_received')}
            </h5>
          }
          unitIcon={
            <PolkadotLogoIcon
              width={20}
              height={20} />
          }
          value={dotAmount.toHuman()}
          unitName='DOT'
          approxUSD={getUsdAmount(dotAmount, prices.polkadot.usd)} />
      </div>
      <InterlayLink
        className={clsx(
          'text-interlayDenim',
          'space-x-1.5',
          'inline-flex',
          'items-center',
          'text-sm'
        )}
        href='https://polkadot.js.org/apps/#/explorer'
        target='_blank'
        rel='noopener noreferrer'>
        <span>{t('issue_page.view_parachain_block')}</span>
        <FaExternalLinkAlt />
      </InterlayLink>
    </RequestWrapper>
  );
};

export default ReimbursedRedeemRequest;
