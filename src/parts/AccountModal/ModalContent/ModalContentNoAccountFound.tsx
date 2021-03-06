import { useTranslation } from 'react-i18next';

import ExternalLink from '@/components/ExternalLink';
import { WALLETS, WalletSourceName } from '@/config/wallets';

interface ModalContentNoAccountFoundProps {
  selectedWallet: WalletSourceName;
}

const ModalContentNoAccountFound = ({ selectedWallet }: ModalContentNoAccountFoundProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    // Create a new account when no accounts are available
    <p>
      {t('account_modal.no_account')}
      <ExternalLink href={selectedWallet && WALLETS[selectedWallet].url}>&nbsp;{t('here')}</ExternalLink>.
    </p>
  );
};

export default ModalContentNoAccountFound;
