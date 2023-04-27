import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Keyring } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { showAccountModalAction, showSignTermsModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { FundWallet } from '@/components';
import { AuthModal, SignTermsModal } from '@/components/AuthModal';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { SS58_FORMAT } from '@/constants';
import InterlayCaliforniaOutlinedButton from '@/legacy-components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDefaultContainedButton from '@/legacy-components/buttons/InterlayDefaultContainedButton';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/legacy-components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import Tokens from '@/legacy-components/Tokens';
import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { KeyringPair, useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import { BitcoinNetwork } from '@/types/bitcoin';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { FeatureFlags, useFeatureFlag } from '@/utils/hooks/use-feature-flag';
import { useSignMessage } from '@/utils/hooks/use-sign-message';

import GetGovernanceTokenUI from './GetGovernanceTokenUI';
import ManualIssueExecutionActionsBadge from './ManualIssueExecutionActionsBadge';

const SMALL_SIZE_BUTTON_CLASSES = clsx('leading-7', '!px-3');

const Topbar = (): JSX.Element => {
  const { bridgeLoaded, showAccountModal, isSignTermsModalOpen } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const isBanxaEnabled = useFeatureFlag(FeatureFlags.BANXA);
  const { setSelectedAccount, removeSelectedAccount } = useSubstrate();
  const { selectProps } = useSignMessage();

  const kintBalanceIsZero = getAvailableBalance('KINT')?.isZero();

  const handleRequestFromFaucet = async (): Promise<void> => {
    if (!selectedAccount) return;

    try {
      const receiverId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, selectedAccount.address);
      await window.faucet.fundAccount(receiverId, GOVERNANCE_TOKEN);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
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
      <div className={clsx('p-4', 'flex', 'items-center', 'justify-end', 'space-x-2')}>
        <ManualIssueExecutionActionsBadge />
        {isBanxaEnabled ? <FundWallet /> : <GetGovernanceTokenUI className={SMALL_SIZE_BUTTON_CLASSES} />}
        {selectedAccount !== undefined && (
          <>
            {process.env.REACT_APP_FAUCET_URL && kintBalanceIsZero && (
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
        <InterlayDefaultContainedButton className={SMALL_SIZE_BUTTON_CLASSES} onClick={handleAccountModalOpen}>
          {accountLabel}
        </InterlayDefaultContainedButton>
      </div>
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
