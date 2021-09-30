
import * as React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  FaExternalLinkAlt,
  FaExclamationCircle
} from 'react-icons/fa';
import { BitcoinAmount } from '@interlay/monetary-js';
import {
  Redeem,
  newMonetaryAmount
} from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import PriceInfo from 'pages/Bridge/PriceInfo';
import InterlayLink from 'components/UI/InterlayLink';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import {
  getUsdAmount,
  displayMonetaryAmount,
  getPolkadotLink
} from 'common/utils/utils';
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
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [
    punishmentCollateralTokenAmount,
    setPunishmentCollateralTokenAmount
  ] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [
          punishmentFee,
          btcDotRate
        ] = await Promise.all([
          window.bridge.interBtcApi.vaults.getPunishmentFee(),
          window.bridge.interBtcApi.oracle.getExchangeRate(COLLATERAL_TOKEN)
        ]);

        const btcAmount = request ? request.amountBTC : BitcoinAmount.zero;
        const theBurnDOTAmount = btcDotRate.toCounter(btcAmount);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        setPunishmentCollateralTokenAmount(thePunishmentDOTAmount);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RetriedRedeemRequest useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    bridgeLoaded
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
          &nbsp;{`${displayMonetaryAmount(punishmentCollateralTokenAmount)} DOT`}
        </span>
        <span>
          &nbsp;({`≈ $${getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)}`})
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
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName='DOT'
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)} />
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
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName='DOT'
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)} />
      </div>
      <InterlayLink
        className={clsx(
          'text-interlayDenim',
          'space-x-1.5',
          'inline-flex',
          'items-center',
          'text-sm'
        )}
        href={getPolkadotLink(request.creationBlock)}
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
