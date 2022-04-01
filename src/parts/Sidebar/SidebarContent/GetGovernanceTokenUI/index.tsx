
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TitleWithUnderline from 'components/TitleWithUnderline';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import InterlayModal, { InterlayModalInnerWrapper } from 'components/UI/InterlayModal';
import InterlayLink from 'components/UI/InterlayLink';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
import { ReactComponent as GateLogoIcon } from 'assets/img/exchanges/gate-logo.svg';
// ray test touch <<
import { ReactComponent as KrakenLogoIcon } from 'assets/img/exchanges/kraken-logo.svg'; // TODO: placeholder
// ray test touch >>

const EXCHANGES = [
  {
    link: 'https://www.kraken.com/en-gb/prices/kint-kintsugi-price-chart/usd-us-dollar?interval=1m',
    icon: (
      <KrakenLogoIcon
        width={146}
        height={23} />
    )
  },
  {
    link: 'https://www.gate.io/de/trade/kint_usdt',
    icon: (
      <GateLogoIcon
        width={138}
        height={55} />
    )
  },
  {
    link: 'https://www.mexc.com/de-DE/exchange/KINT_USDT',
    icon: (
      // ray test touch <<
      // TODO: placeholder
      <GateLogoIcon
        width={138}
        height={55} />
      // ray test touch >>
    )
  },
  {
    link: 'https://dex.zenlink.pro/#/swap',
    icon: (
      // ray test touch <<
      // TODO: placeholder
      <GateLogoIcon
        width={138}
        height={55} />
      // ray test touch >>
    )
  }
];

interface ExchangeLinkProps {
  href: string;
  icon: React.ReactNode;
}

const ExchangeLink = ({
  href,
  icon
}: ExchangeLinkProps) => {
  return (
    <InterlayLink
      className={clsx(
        'rounded-xl',
        'grid',
        'place-items-center',
        'h-24',
        LIGHT_DARK_BORDER_CLASSES
      )}
      target='_blank'
      rel='noopener noreferrer'
      href={href}>
      {icon}
    </InterlayLink>
  );
};

const GetGovernanceTokenUI = (): JSX.Element => {
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

  return (
    <>
      <InterlayDefaultOutlinedButton
        className='m-4'
        onClick={handleModalOpen}>
        {getGovernanceTokenLabel}
      </InterlayDefaultOutlinedButton>
      <InterlayModal
        initialFocus={focusRef}
        open={modalOpen}
        onClose={handleModalClose}>
        <InterlayModalInnerWrapper
          className={clsx(
            'p-6',
            'max-w-lg'
          )}>
          <TitleWithUnderline text={getGovernanceTokenLabel} />
          <div
            className={clsx(
              'px-4',
              'py-2',
              'space-y-10'
            )}>
            <p className='text-center'>
              {/* ray test touch << */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel sagittis magna. Integer ex orci.
              {/* ray test touch >> */}
            </p>
            <div
              className={clsx(
                'grid',
                'grid-cols-2',
                'gap-x-3',
                'gap-y-2'
              )}>
              {EXCHANGES.map(item => (
                <ExchangeLink
                  key={item.link}
                  href={item.link}
                  icon={item.icon} />
              ))}
            </div>
          </div>
        </InterlayModalInnerWrapper>
      </InterlayModal>
    </>
  );
};

export default GetGovernanceTokenUI;
