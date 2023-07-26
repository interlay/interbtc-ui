import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Keyring } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction, showSignTermsModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { FundWallet, NotificationsPopover } from '@/components';
import { AuthModal, SignTermsModal } from '@/components/AuthModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { SS58_FORMAT } from '@/constants';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useSignMessage } from '@/hooks/use-sign-message';
import InterlayCaliforniaOutlinedButton from '@/legacy-components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDefaultContainedButton from '@/legacy-components/buttons/InterlayDefaultContainedButton';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/legacy-components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import Tokens from '@/legacy-components/Tokens';
import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { KeyringPair, useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import { BitcoinNetwork } from '@/types/bitcoin';
import { POLKADOT } from '@/utils/constants/relay-chain-names';
import { NotificationToastType, useNotifications } from '@/utils/context/Notifications';

import ManualIssueExecutionActionsBadge from './ManualIssueExecutionActionsBadge';

const SMALL_SIZE_BUTTON_CLASSES = clsx('leading-7', '!px-3');

const Topbar = (): JSX.Element => {
  const { bridgeLoaded, showAccountModal, isSignTermsModalOpen } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  const { selectProps } = useSignMessage();
  const notifications = useNotifications();

  const governanceTokenBalanceIsZero = getAvailableBalance(GOVERNANCE_TOKEN.ticker)?.isZero();

  const handleRequestFromFaucet = async (): Promise<void> => {
    if (!selectedAccount) return;

    try {
      const receiverId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, selectedAccount.address);
      await window.faucet.fundAccount(receiverId, GOVERNANCE_TOKEN);

      notifications.show('faucet', {
        type: NotificationToastType.STANDARD,
        props: { variant: 'success', title: t('notifications.funding_account_successful') }
      });
    } catch (error) {
      notifications.show('faucet', {
        type: NotificationToastType.STANDARD,
        props: { variant: 'error', title: t('notifications.funding_account_failed') }
      });
    }
  };

  const [isRequestPending, setIsRequestPending] = React.useState(false);

  const { extensions, selectedAccount } = useSubstrateSecureState();

  const handleFundsRequest = async () => {
    if (!bridgeLoaded) return;
    setIsRequestPending(true);
    try {
      await handleRequestFromFaucet();
    } catch (error) {
      console.log('[requestFunds] error.message => ', error.message);
    }
    setIsRequestPending(false);
  };

  const handleAccountModalOpen = () => dispatch(showAccountModalAction(true));

  const handleAccountModalClose = () => dispatch(showAccountModalAction(false));

  const handleAccountSelect = (account: InjectedAccountWithMeta) => {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: SS58_FORMAT });
    const keyringAccount = keyring.addFromAddress(account.address, account.meta);
    setSelectedAccount(keyringAccount);
    selectProps.onSelectionChange(keyringAccount as KeyringPair);
    handleAccountModalClose();
  };

  const handleDisconnect = () => {
    removeSelectedAccount();
    handleAccountModalClose();
  };

  const handleCloseSignTermsModal = () => dispatch(showSignTermsModalAction(false));

  let accountLabel;
  if (!extensions.length) {
    accountLabel = t('connect_wallet');
  } else if (selectedAccount) {
    accountLabel = selectedAccount.meta.name;
  } else {
    accountLabel = 'Select Wallet';
  }

  return (
    <>
      <header className={clsx('p-4', 'flex', 'items-center', 'justify-end', 'space-x-2')}>
        <ManualIssueExecutionActionsBadge />
        <FundWallet />
        {selectedAccount !== undefined && (
          <>
            {process.env.REACT_APP_FAUCET_URL && governanceTokenBalanceIsZero && (
              <>
                <InterlayDenimOrKintsugiMidnightOutlinedButton
                  className={SMALL_SIZE_BUTTON_CLASSES}
                  pending={isRequestPending}
                  onClick={handleFundsRequest}
                >
                  {t('request_funds')}
                </InterlayDenimOrKintsugiMidnightOutlinedButton>
              </>
            )}
            {process.env.REACT_APP_BITCOIN_NETWORK !== BitcoinNetwork.Mainnet && (
              <>
                <InterlayLink
                  className='hover:no-underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://bitcoinfaucet.uo1.net'
                >
                  <InterlayCaliforniaOutlinedButton
                    className={SMALL_SIZE_BUTTON_CLASSES}
                    endIcon={<ArrowTopRightOnSquareIcon className={clsx('w-4', 'h-4', 'ml-1')} />}
                  >
                    {t('request_btc')}
                  </InterlayCaliforniaOutlinedButton>
                </InterlayLink>
              </>
            )}
            <Tokens />
          </>
        )}
        <div
          className={clsx({
            'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT
          })}
        >
          <NotificationsPopover address={selectedAccount?.address} items={notifications.list} />
        </div>
        <InterlayDefaultContainedButton className={SMALL_SIZE_BUTTON_CLASSES} onClick={handleAccountModalOpen}>
          {accountLabel}
        </InterlayDefaultContainedButton>
      </header>
      <AuthModal
        isOpen={showAccountModal}
        onClose={handleAccountModalClose}
        onDisconnect={handleDisconnect}
        onAccountSelect={handleAccountSelect}
      />
      <SignTermsModal isOpen={isSignTermsModalOpen} onClose={handleCloseSignTermsModal} />
    </>
  );
};

export default Topbar;