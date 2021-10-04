
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { ParachainStatus } from 'common/types/util.types';

interface Props {
  status: ParachainStatus;
  className?: string;
}

const ParachainStatusInfo = ({
  status,
  className
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  switch (status) {
  case ParachainStatus.Loading:
    return (
      <p
        className={clsx(
          'text-sm',
          'text-interlayDenim',
          'font-medium',
          className
        )}>
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
      <div
        className={clsx(
          'text-interlayCinnabar',
          'font-medium',
          'text-sm',
          className
        )}>
        <p>
          {t('issue_redeem_disabled')}
        </p>
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
