import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { useWallet } from '@/lib/wallet/WalletProvider';

import { AuthModal } from './AuthModal';
import { StyledCTA } from './AuthModal.style';

const WalletModalTrigger = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { account } = useWallet();

  const { showAccountModal } = useSelector((state: StoreType) => state.general);

  const handleModalOpen = () => dispatch(showAccountModalAction(true));

  const handleModalClose = () => dispatch(showAccountModalAction(false));

  return (
    <>
      <StyledCTA variant='outlined' onPress={handleModalOpen}>
        {account ? account?.name || 'Wallet' : t('connect_wallet')}
      </StyledCTA>
      <AuthModal isOpen={showAccountModal} onClose={handleModalClose} />
    </>
  );
};

export { WalletModalTrigger };
