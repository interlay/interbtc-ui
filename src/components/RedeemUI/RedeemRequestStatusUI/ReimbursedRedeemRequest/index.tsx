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
  RELAY_CHAIN_NATIVE_TOKEN,
  WRAPPED_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  RelayChainNativeTokenLogoIcon
} from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { getUsdAmount, displayMonetaryAmount, getPolkadotLink } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { getColorShade } from 'utils/helpers/colors';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const ReimbursedRedeemRequest = ({ redeem }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded, prices } = useSelector((state: StoreType) => state.general);
  const [burnedBTCAmount, setBurnedBTCAmount] = React.useState(BitcoinAmount.zero);
  const [punishmentCollateralTokenAmount, setPunishmentCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );
  const [burnCollateralTokenAmount, setBurnCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );
  const [collateralTokenAmount, setCollateralTokenAmount] = React.useState(
    newMonetaryAmount(0, RELAY_CHAIN_NATIVE_TOKEN)
  );

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!redeem) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [punishmentFee, btcDotRate] = await Promise.all([
          window.bridge.vaults.getPunishmentFee(),
          window.bridge.oracle.getExchangeRate(RELAY_CHAIN_NATIVE_TOKEN)
        ]);

        const burnedBTCAmount = redeem.request.requestedAmountBacking.add(redeem.bridgeFee);
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
  }, [redeem, bridgeLoaded]);

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium', getColorShade('green'))}>{t('redeem_page.reimburse_success')}</h2>
      <p className='w-full'>
        {t('redeem_page.burn_notice', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL,
          collateralTokenSymbol: RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
        })}
      </p>
      <p className='font-medium'>
        <span className={getColorShade('red')}>
          {`${displayMonetaryAmount(burnedBTCAmount)} ${WRAPPED_TOKEN_SYMBOL}`}
        </span>
        <span>&nbsp;{`(≈ $${getUsdAmount(burnedBTCAmount, prices.bitcoin?.usd)})`}</span>
        <span className={getColorShade('red')}>&nbsp;{t('redeem_page.reimbursed').toLowerCase()}</span>.
      </p>
      <p className='font-medium'>
        <PrimaryColorSpan>{t('redeem_page.recover_receive_dot')}</PrimaryColorSpan>
        <PrimaryColorSpan>
          &nbsp;{`${displayMonetaryAmount(collateralTokenAmount)} ${RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}`}
        </PrimaryColorSpan>
        <span>&nbsp;{`(≈ $${getUsdAmount(collateralTokenAmount, prices.relayChainNativeToken?.usd)})`}</span>
        <PrimaryColorSpan>&nbsp;{t('redeem_page.recover_receive_total')}</PrimaryColorSpan>.
      </p>
      <div className='w-full'>
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('redeem_page.compensation_burn', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </h5>
          }
          unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
          value={displayMonetaryAmount(burnCollateralTokenAmount)}
          unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(burnCollateralTokenAmount, prices.relayChainNativeToken?.usd)}
        />
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('redeem_page.compensation_payment')}
            </h5>
          }
          unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
          value={displayMonetaryAmount(punishmentCollateralTokenAmount)}
          unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(punishmentCollateralTokenAmount, prices.relayChainNativeToken?.usd)}
        />
        <Hr2 className={clsx('border-t-2', 'my-2.5')} />
        <PriceInfo
          className='w-full'
          title={
            <h5
              className={clsx(
                { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('you_received')}
            </h5>
          }
          unitIcon={<RelayChainNativeTokenLogoIcon width={20} />}
          value={displayMonetaryAmount(collateralTokenAmount)}
          unitName={RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
          approxUSD={getUsdAmount(collateralTokenAmount, prices.relayChainNativeToken?.usd)}
        />
      </div>
      <ExternalLink className='text-sm' href={getPolkadotLink(redeem.request.height.absolute)}>
        {t('issue_page.view_parachain_block')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default ReimbursedRedeemRequest;
