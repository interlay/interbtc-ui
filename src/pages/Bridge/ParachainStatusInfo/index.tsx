import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ParachainStatus } from '@/common/types/util.types';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

interface Props {
  status: ParachainStatus;
  className?: string;
}

const ParachainStatusInfo = ({ status, className }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  switch (status) {
    case ParachainStatus.Loading:
      return (
        <p
          className={clsx(
            'text-sm',
            { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'font-medium',
            className
          )}
        >
          {t('interbtc_bridge_loading', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
      );
    case ParachainStatus.Running:
      return null;
    // Shutdown and Error cases
    default:
      return (
        <div className={clsx(getColorShade('red'), 'font-medium', 'text-sm', className)}>
          <p>{t('issue_redeem_disabled')}</p>
          <p>
            {t('interbtc_bridge_recovery_mode', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </p>
        </div>
      );
  }
};

export default ParachainStatusInfo;
