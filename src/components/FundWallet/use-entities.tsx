import { ReactNode } from 'react';

import BANXA_INTERLAY from '@/assets/img/banxa-dark.png';
import BANXA_KITNSUGI from '@/assets/img/banxa-white.png';
import { ReactComponent as AcalaLogoIcon } from '@/assets/img/exchanges/acala-logo.svg';
import { ReactComponent as GateLogoIcon } from '@/assets/img/exchanges/gate-logo.svg';
import { ReactComponent as KrakenLogoIcon } from '@/assets/img/exchanges/kraken-logo.svg';
import { ReactComponent as MexcLogoForInterlayIcon } from '@/assets/img/exchanges/mexc-logo-for-interlay.svg';
import { ReactComponent as MexcLogoForKintsugiIcon } from '@/assets/img/exchanges/mexc-logo-for-kintsugi.svg';
import { ReactComponent as StellaSwapLogoIcon } from '@/assets/img/exchanges/stellaswap-logo.svg';
import { ReactComponent as ZenlinkLogoIcon } from '@/assets/img/exchanges/zenlink-logo.svg';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { EXTERNAL_PAGES, EXTERNAL_QUERY_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const queryString = require('query-string');

type FundWalletEntities = { pathname: string; search?: string; icon: ReactNode };

type UseEntitiesResult = {
  exchanges: FundWalletEntities[];
  payments: FundWalletEntities[];
};

const useEntities = (): UseEntitiesResult => {
  const banxaLink = {
    pathname: EXTERNAL_PAGES.BANXA,
    search: queryString.stringify({
      [EXTERNAL_QUERY_PARAMETERS.BANXA.FIAT_TYPE]: 'EUR',
      [EXTERNAL_QUERY_PARAMETERS.BANXA.COIN_TYPE]: GOVERNANCE_TOKEN.ticker
    })
  };

  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
    const exchanges = [
      {
        pathname: 'https://acala.network/',
        icon: <AcalaLogoIcon width={122} height={48} />
      },
      {
        pathname: 'https://stellaswap.com/',
        icon: <StellaSwapLogoIcon width={122} height={25} />
      },
      {
        pathname: 'https://trade.kraken.com/charts/KRAKEN:INTR-USD',
        icon: <KrakenLogoIcon width={122} height={20} />
      },
      {
        pathname: 'https://www.gate.io/trade/INTR_USDT',
        icon: <GateLogoIcon width={122} height={37} />
      },
      {
        pathname: 'https://www.mexc.com/exchange/INTR_USDT',
        icon: <MexcLogoForInterlayIcon width={148} height={18} />
      }
    ];

    const payments = [
      {
        ...banxaLink,
        icon: <img src={BANXA_INTERLAY} alt='banxa' />
      }
    ];

    return {
      exchanges,
      payments
    };
  } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    const exchanges = [
      {
        pathname: 'https://www.kraken.com/en-gb/prices/kint-kintsugi-price-chart/usd-us-dollar?interval=1m',
        icon: <KrakenLogoIcon width={122} height={20} />
      },
      {
        pathname: 'https://www.gate.io/de/trade/kint_usdt',
        icon: <GateLogoIcon width={122} height={37} />
      },
      {
        pathname: 'https://dex.zenlink.pro/#/swap',
        icon: <ZenlinkLogoIcon width={119} height={35} />
      },
      {
        pathname: 'https://www.mexc.com/de-DE/exchange/KINT_USDT',
        icon: <MexcLogoForKintsugiIcon width={167} height={21} />
      }
    ];

    const payments = [{ ...banxaLink, icon: <img src={BANXA_KITNSUGI} alt='banxa' /> }];

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
