import { ReactNode } from 'react';
import { LinkProps } from 'react-router-dom';

import BANXA_INTERLAY from '@/assets/img/banxa-dark.png';
import BANXA_KITNSUGI from '@/assets/img/banxa-white.png';
import { ReactComponent as AcalaLogoIcon } from '@/assets/img/exchanges/acala-logo.svg';
import { ReactComponent as GateLogoIcon } from '@/assets/img/exchanges/gate-logo.svg';
import { ReactComponent as KrakenLogoIcon } from '@/assets/img/exchanges/kraken-logo.svg';
import { ReactComponent as LbankLogoIcon } from '@/assets/img/exchanges/lbank-logo.svg';
import { ReactComponent as MexcLogoForInterlayIcon } from '@/assets/img/exchanges/mexc-logo-for-interlay.svg';
import { ReactComponent as MexcLogoForKintsugiIcon } from '@/assets/img/exchanges/mexc-logo-for-kintsugi.svg';
import { ReactComponent as StellaSwapLogoIcon } from '@/assets/img/exchanges/stellaswap-logo.svg';
import { ReactComponent as ZenlinkLogoIcon } from '@/assets/img/exchanges/zenlink-logo.svg';
import { BANXA_LINK, LINK_QUERY_PARAMETERS } from '@/config/links';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { useWallet } from '@/utils/hooks/use-wallet';

const queryString = require('query-string');

type FundWalletEntities = { link: LinkProps['to']; icon: ReactNode };

type UseEntitiesResult = {
  exchanges: FundWalletEntities[];
  payments: FundWalletEntities[];
};

const useEntities = (): UseEntitiesResult => {
  const wallet = useWallet();

  const banxaLink = {
    pathname: BANXA_LINK,
    search: queryString.stringify({
      [LINK_QUERY_PARAMETERS.BANXA.WALLET_ADDRESS]: wallet.getRelayChainAddress(),
      [LINK_QUERY_PARAMETERS.BANXA.FIAT_TYPE]: 'EUR',
      [LINK_QUERY_PARAMETERS.BANXA.COIN_TYPE]: GOVERNANCE_TOKEN.ticker
    })
  };

  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
    const exchanges = [
      {
        link: 'https://acala.network/',
        icon: <AcalaLogoIcon width={122} height={48} />
      },
      {
        link: 'https://stellaswap.com/',
        icon: <StellaSwapLogoIcon width={122} height={25} />
      },
      {
        link: 'https://trade.kraken.com/charts/KRAKEN:INTR-USD',
        icon: <KrakenLogoIcon width={122} height={20} />
      },
      {
        link: 'https://www.gate.io/trade/INTR_USDT',
        icon: <GateLogoIcon width={122} height={37} />
      },
      {
        link: 'https://www.mexc.com/exchange/INTR_USDT',
        icon: <MexcLogoForInterlayIcon width={148} height={18} />
      },
      {
        link: 'https://www.lbank.info/exchange/intr/usdt',
        icon: <LbankLogoIcon width={117} height={22} />
      }
    ];

    const payments = [{ link: banxaLink, icon: <img src={BANXA_INTERLAY} alt='banxa' /> }];

    return {
      exchanges,
      payments
    };
  } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    const exchanges = [
      {
        link: 'https://www.kraken.com/en-gb/prices/kint-kintsugi-price-chart/usd-us-dollar?interval=1m',
        icon: <KrakenLogoIcon width={122} height={20} />
      },
      {
        link: 'https://www.gate.io/de/trade/kint_usdt',
        icon: <GateLogoIcon width={122} height={37} />
      },
      {
        link: 'https://dex.zenlink.pro/#/swap',
        icon: <ZenlinkLogoIcon width={119} height={35} />
      },
      {
        link: 'https://www.mexc.com/de-DE/exchange/KINT_USDT',
        icon: <MexcLogoForKintsugiIcon width={167} height={21} />
      }
    ];

    const payments = [{ link: banxaLink, icon: <img src={BANXA_KITNSUGI} alt='banxa' /> }];

    return {
      exchanges,
      payments
    };
  } else {
    throw new Error(`Error: REACT_APP_RELAY_CHAIN_NAME=${process.env.REACT_APP_RELAY_CHAIN_NAME} is not valid`);
  }
};

export { useEntities };
export type { UseEntitiesResult };
