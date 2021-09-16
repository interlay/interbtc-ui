
import * as React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  FaExternalLinkAlt,
  FaExclamationCircle
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

const RetriedRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [punishmentDOTAmount, setPunishmentDOTAmount] = React.useState(PolkadotAmount.zero);

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

        const btcAmount = request ? request.amountBTC : BitcoinAmount.zero;
        const theBurnDOTAmount = btcDotRate.toCounter(btcAmount);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        setPunishmentDOTAmount(thePunishmentDOTAmount);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RetriedRedeemRequest useEffect] error.message => ', error.message);
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
        {t('redeem_page.compensation_success')}
      </h2>
      <p className='w-full'>{t('redeem_page.compensation_notice')}</p>
      <p className='font-medium'>
        <span className='text-interlayDenim'>
          {t('redeem_page.recover_receive_dot')}
        </span>
        <span className='text-interlayDenim'>
          &nbsp;{`${punishmentDOTAmount.toHuman()} DOT`}
        </span>
        <span>
          &nbsp;({`≈ $${getUsdAmount(punishmentDOTAmount, prices.polkadot.usd)}`})
        </span>
        <span className='text-interlayDenim'>
          &nbsp;{t('redeem_page.recover_receive_total')}.
        </span>
      </p>
      <div className='w-full'>
        <PriceInfo
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
          value={punishmentDOTAmount.toHuman()}
          unitName='DOT'
          approxUSD={getUsdAmount(punishmentDOTAmount, prices.polkadot.usd)} />
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
      <div className='w-full'>
        <h6
          className={clsx(
            'flex',
            'items-center',
            'justify-center',
            'space-x-0.5',
            'text-interlayCinnabar'
          )}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
        </h6>
        <p
          className={clsx(
            'text-justify',
            'text-textSecondary'
          )}>
          {t('redeem_page.retry_new_redeem')}
        </p>
      </div>
    </RequestWrapper>
  );
};

export default RetriedRedeemRequest;
