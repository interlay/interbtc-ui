import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { showSignTermsModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { FundWallet, NotificationsPopover } from '@/components';
import { SignTermsModal, WalletModalTrigger } from '@/components/WalletModalTrigger';
import InterlayCaliforniaOutlinedButton from '@/legacy-components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/legacy-components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import Tokens from '@/legacy-components/Tokens';
import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { useWallet } from '@/lib/wallet/WalletProvider';
import { BitcoinNetwork } from '@/types/bitcoin';
import { POLKADOT } from '@/utils/constants/relay-chain-names';
import { useNotifications } from '@/utils/context/Notifications';
import { useFaucet } from '@/utils/hooks/use-faucet';

import ManualIssueExecutionActionsBadge from './ManualIssueExecutionActionsBadge';

const SMALL_SIZE_BUTTON_CLASSES = clsx('leading-7', '!px-3');

const Topbar = (): JSX.Element => {
  const { isSignTermsModalOpen } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // const { removeSelectedAccount } = useSubstrate();
  // const { selectProps } = useSignMessage();
  const notifications = useNotifications();

  const { buttonProps, isAvailable } = useFaucet();

  const { account } = useWallet();

  const handleCloseSignTermsModal = () => dispatch(showSignTermsModalAction(false));

  return (
    <>
      <header className={clsx('p-4', 'flex', 'items-center', 'justify-end', 'space-x-2')}>
        <ManualIssueExecutionActionsBadge />
        <FundWallet />
        {isAvailable && (
          <InterlayDenimOrKintsugiMidnightOutlinedButton className={SMALL_SIZE_BUTTON_CLASSES} {...buttonProps}>
            {t('request_funds')}
          </InterlayDenimOrKintsugiMidnightOutlinedButton>
        )}
        {account !== undefined && (
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
          <NotificationsPopover address={account?.address} items={notifications.list} />
        </div>
        <WalletModalTrigger />
      </header>

      <SignTermsModal isOpen={isSignTermsModalOpen} onClose={handleCloseSignTermsModal} />
    </>
  );
};

export default Topbar;
