import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TitleWithUnderline from 'components/TitleWithUnderline';
import InterlayDefaultOutlinedButton, {
  Props as InterlayDefaultOutlinedButtonProps
} from 'components/buttons/InterlayDefaultOutlinedButton';
import InterlayModal, { InterlayModalInnerWrapper } from 'components/UI/InterlayModal';
import InterlayLink from 'components/UI/InterlayLink';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
// ray test touch <
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
// ray test touch >
import { BORDER_CLASSES } from 'utils/constants/styles';
import { ReactComponent as GateLogoIcon } from 'assets/img/exchanges/gate-logo.svg';
import { ReactComponent as KrakenLogoIcon } from 'assets/img/exchanges/kraken-logo.svg';
import { ReactComponent as MexcLogoForKintsugiIcon } from 'assets/img/exchanges/mexc-logo-for-kintsugi.svg';
// ray test touch <
import { ReactComponent as MexcLogoForInterlayIcon } from 'assets/img/exchanges/mexc-logo-for-interlay.svg';
// ray test touch >
import { ReactComponent as ZenlinkLogoIcon } from 'assets/img/exchanges/zenlink-logo.svg';
// ray test touch <
import { ReactComponent as LbankLogoIcon } from 'assets/img/exchanges/lbank-logo.svg';
// ray test touch >

// ray test touch <
let exchanges: Array<{
  link: string;
  icon: React.ReactNode;
}>;

if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
  exchanges = [
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
} else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
  exchanges = [
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
} else {
  throw new Error('Something went wrong!');
}
// ray test touch >

interface ExchangeLinkProps {
  href: string;
  icon: React.ReactNode;
}

const ExchangeLink = ({ href, icon }: ExchangeLinkProps) => {
  return (
    <InterlayLink
      className={clsx('rounded-xl', 'grid', 'place-items-center', 'h-24', BORDER_CLASSES)}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
    >
      {icon}
    </InterlayLink>
  );
};

const GetGovernanceTokenUI = (props: InterlayDefaultOutlinedButtonProps): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const focusRef = React.useRef(null);
  const { t } = useTranslation();

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getGovernanceTokenLabel = t('get_governance_token', {
    governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
  });

  const getGovernanceTokenDescriptionLabel = t('get_governance_token_description', {
    governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
  });

  return (
    <>
      <InterlayDefaultOutlinedButton onClick={handleModalOpen} {...props}>
        {getGovernanceTokenLabel}
      </InterlayDefaultOutlinedButton>
      <InterlayModal initialFocus={focusRef} open={modalOpen} onClose={handleModalClose}>
        <InterlayModalInnerWrapper className={clsx('p-6', 'max-w-lg')}>
          <TitleWithUnderline text={getGovernanceTokenLabel} />
          <div className={clsx('px-4', 'py-2', 'space-y-10')}>
            <p className='text-center'>{getGovernanceTokenDescriptionLabel}</p>
            <div className={clsx('grid', 'grid-cols-2', 'gap-x-3', 'gap-y-2')}>
              {/* ray test touch < */}
              {exchanges.map((item) => (
                <ExchangeLink key={item.link} href={item.link} icon={item.icon} />
              ))}
              {/* ray test touch > */}
            </div>
          </div>
        </InterlayModalInnerWrapper>
      </InterlayModal>
    </>
  );
};

export default GetGovernanceTokenUI;
