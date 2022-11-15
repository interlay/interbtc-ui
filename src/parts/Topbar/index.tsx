import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import InterlayCaliforniaOutlinedButton from '@/components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDefaultContainedButton from '@/components/buttons/InterlayDefaultContainedButton';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import Tokens from '@/components/Tokens';
import InterlayLink from '@/components/UI/InterlayLink';
import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import { GOVERNANCE_TOKEN, GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useSubstrateSecureState } from '@/lib/substrate';
import AccountModal from '@/parts/AccountModal';
import { BitcoinNetwork } from '@/types/bitcoin';

import GetGovernanceTokenUI from './GetGovernanceTokenUI';
import ManualIssueExecutionActionsBadge from './ManualIssueExecutionActionsBadge';

const SMALL_SIZE_BUTTON_CLASSES = clsx('leading-7', '!px-3');

const Topbar = (): JSX.Element => {
  const { bridgeLoaded, showAccountModal } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const handleAccountModalOpen = () => {
    dispatch(showAccountModalAction(true));
  };

  const handleAccountModalClose = () => {
    dispatch(showAccountModalAction(false));
  };

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
        <GetGovernanceTokenUI className={SMALL_SIZE_BUTTON_CLASSES} />
        {selectedAccount !== undefined && (
          <>
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
                <InterlayDenimOrKintsugiMidnightOutlinedButton
                  className={SMALL_SIZE_BUTTON_CLASSES}
                  pending={isRequestPending}
                  onClick={handleFundsRequest}
                >
                  {t('request_funds', {
                    tokenSymbol: GOVERNANCE_TOKEN_SYMBOL
                  })}
                </InterlayDenimOrKintsugiMidnightOutlinedButton>
              </>
            )}
            <Tokens />
          </>
        )}
        <InterlayDefaultContainedButton className={SMALL_SIZE_BUTTON_CLASSES} onClick={handleAccountModalOpen}>
          {accountLabel}
        </InterlayDefaultContainedButton>
      </div>
      <AccountModal open={showAccountModal} onClose={handleAccountModalClose} />
    </>
  );
};

export default Topbar;
