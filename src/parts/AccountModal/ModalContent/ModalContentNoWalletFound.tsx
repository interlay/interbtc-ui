import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import ExternalLink from '@/components/ExternalLink';
import { TERMS_AND_CONDITIONS_LINK } from '@/config/relay-chains';
import { WALLETS } from '@/config/wallets';

const ModalContentNoWalletFound = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <p>
        {t('account_modal.install_supported_wallets')}
        <ExternalLink href={TERMS_AND_CONDITIONS_LINK}>terms and conditions</ExternalLink>.
      </p>
      <ul className={clsx('flex', 'flex-col', 'space-y-4')}>
        {
          /* Lists all supported wallets. */
          Object.values(WALLETS).map(({ name, LogoIcon, url }) => (
            <li key={name}>
              <ExternalLink href={url}>
                <span className={clsx('inline-flex', 'items-center', 'space-x-1.5')}>
                  <LogoIcon width={30} height={30} />
                  <span>{name}</span>
                </span>
              </ExternalLink>
            </li>
          ))
        }
      </ul>
    </>
  );
};

export default ModalContentNoWalletFound;
