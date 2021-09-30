
import * as React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  FaExternalLinkAlt
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

const ReimbursedRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const [burnedBTCAmount, setBurnedBTCAmount] = React.useState(BitcoinAmount.zero);
  const [
    punishmentCollateralTokenAmount,
    setPunishmentCollateralTokenAmount
  ] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));
  const [
    burnCollateralTokenAmount,
    setBurnCollateralTokenAmount
  ] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));
  const [collateralTokenAmount, setCollateralTokenAmount] = React.useState(newMonetaryAmount(0, COLLATERAL_TOKEN));

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

        const burnedBTCAmount = request ?
          request.amountBTC.add(request.bridgeFee) :
          BitcoinAmount.zero;
        const theBurnDOTAmount = btcDotRate.toCounter(burnedBTCAmount);
        const thePunishmentDOTAmount = theBurnDOTAmount.mul(new Big(punishmentFee));
        const theDOTAmount = theBurnDOTAmount.add(thePunishmentDOTAmount);
        setBurnedBTCAmount(burnedBTCAmount);
        setPunishmentCollateralTokenAmount(thePunishmentDOTAmount);
        setBurnCollateralTokenAmount(theBurnDOTAmount);
        setPunishmentCollateralTokenAmount(thePunishmentDOTAmount);
        setCollateralTokenAmount(theDOTAmount);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[ReimbursedRedeemRequest useEffect] error.message => ', error.message);
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
        {t('redeem_page.reimburse_success')}
      </h2>
      <p className='w-full'>
        {t('redeem_page.burn_notice')}
      </p>
      <p className='font-medium'>
        <span className='text-interlayCinnabar'>
          {`${displayMonetaryAmount(burnedBTCAmount)} interBTC`}
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
          &nbsp;{`${displayMonetaryAmount(collateralTokenAmount)} DOT`}
        </span>
        <span>
          &nbsp;{`(≈ $${getUsdAmount(collateralTokenAmount, prices.collateralToken.usd)})`}
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
          value={displayMonetaryAmount(burnCollateralTokenAmount)}
          unitName='DOT'
          approxUSD={getUsdAmount(burnCollateralTokenAmount, prices.collateralToken.usd)} />
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
          value={displayMonetaryAmount(collateralTokenAmount)}
          unitName='DOT'
          approxUSD={getUsdAmount(collateralTokenAmount, prices.collateralToken.usd)} />
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
    </RequestWrapper>
  );
};

export default ReimbursedRedeemRequest;
