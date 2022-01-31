import * as React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';
import { newMonetaryAmount } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import PriceInfo from 'pages/Bridge/PriceInfo';
import ExternalLink from 'components/ExternalLink';
import PrimaryColorSpan from 'components/PrimaryColorSpan';
import Hr2 from 'components/hrs/Hr2';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  COLLATERAL_TOKEN_SYMBOL,
  CollateralTokenLogoIcon
} from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  getUsdAmount,
  displayMonetaryAmount,
  getPolkadotLink
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
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

        const burnedBTCAmount = request.request.requestedAmountBacking.add(request.bridgeFee);
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
        {t('redeem_page.burn_notice', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL,
          collateralTokenSymbol: COLLATERAL_TOKEN_SYMBOL
        })}
      </p>
      <p className='font-medium'>
        <span className='text-interlayCinnabar'>
          {`${displayMonetaryAmount(burnedBTCAmount)} ${WRAPPED_TOKEN_SYMBOL}`}
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
        <PrimaryColorSpan>
          {t('redeem_page.recover_receive_dot')}
        </PrimaryColorSpan>
        <PrimaryColorSpan>
          &nbsp;{`${displayMonetaryAmount(collateralTokenAmount)} ${COLLATERAL_TOKEN_SYMBOL}`}
        </PrimaryColorSpan>
        <span>
          &nbsp;{`(≈ $${getUsdAmount(collateralTokenAmount, prices.collateralToken.usd)})`}
        </span>
        <PrimaryColorSpan>
          &nbsp;{t('redeem_page.recover_receive_total')}
        </PrimaryColorSpan>
        .
      </p>
      <div className='w-full'>
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}>
              {t('redeem_page.compensation_burn', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </h5>
          }
          unitIcon={
            <CollateralTokenLogoIcon width={20} />
          }
          value={displayMonetaryAmount(burnCollateralTokenAmount)}
          unitName={COLLATERAL_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(burnCollateralTokenAmount, prices.collateralToken.usd)} />
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}>
              {t('redeem_page.compensation_payment')}
            </h5>
          }
          unitIcon={
            <CollateralTokenLogoIcon width={20} />
          }
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName={COLLATERAL_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.collateralToken.usd)} />
        <Hr2
          className={clsx(
            'border-t-2',
            'my-2.5'
          )} />
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}>
              {t('you_received')}
            </h5>
          }
          unitIcon={
            <CollateralTokenLogoIcon width={20} />
          }
          value={displayMonetaryAmount(collateralTokenAmount)}
          unitName={COLLATERAL_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(collateralTokenAmount, prices.collateralToken.usd)} />
      </div>
      <ExternalLink
        className='text-sm'
        href={getPolkadotLink(request.request.height.absolute)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default ReimbursedRedeemRequest;
