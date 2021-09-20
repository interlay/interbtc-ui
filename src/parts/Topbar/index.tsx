
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { web3Accounts } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import Balances from './Balances';
import AccountModal from 'parts/AccountModal';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { showAccountModalAction } from 'common/actions/general.actions';
import { StoreType } from 'common/types/util.types';

// TODO: could create a specific prop
const SMALL_SIZE_BUTTON_CLASS_NAME = clsx(
  'leading-4',
  '!px-3'
);

const Topbar = (): JSX.Element => {
  // ray test touch <
  const {
    extensions,
    address,
    bridgeLoaded,
    collateralTokenBalance,
    wrappedTokenBalance,
    showAccountModal
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRequestDotFromFaucet = async (): Promise<void> => {
    if (!address) return;

    try {
      const receiverId = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
    }
  };

  const [isRequestPending, setIsRequestPending] = React.useState(false);

  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  React.useEffect(() => {
    if (!extensions.length) return;

    (async () => {
      try {
        const theAccounts = await web3Accounts();
        setAccounts(theAccounts);
      } catch (error) {
        // TODO: should add error handling properly
        console.log('[Topbar] error.message => ', error.message);
      }
    })();
  }, [extensions.length]);

  const requestDOT = async () => {
    if (!bridgeLoaded) return;
    setIsRequestPending(true);
    try {
      await handleRequestDotFromFaucet();
    } catch (error) {
      console.log('[requestDOT] error.message => ', error.message);
    }
    setIsRequestPending(false);
  };

  const handleAccountModalOpen = () => {
    dispatch(showAccountModalAction(true));
  };

  const handleAccountModalClose = () => {
    dispatch(showAccountModalAction(false));
  };
  // ray test touch >

  let accountLabel;
  if (!extensions.length) {
    accountLabel = t('connect_wallet');
  } else if (address) {
    const matchedAccount = accounts.find(account => account.address === address);
    accountLabel = matchedAccount?.meta.name || address;
  } else {
    accountLabel = 'Select Account';
  }

  return (
    <>
      <div
        className={clsx(
          'p-4',
          'flex',
          'items-center',
          'justify-end',
          'space-x-2'
        )}>
        {address !== undefined && (
          <>
            {address === '' ? (
              <InterlayDefaultContainedButton
                className={SMALL_SIZE_BUTTON_CLASS_NAME}
                onClick={handleAccountModalOpen}>
                {accountLabel}
              </InterlayDefaultContainedButton>
            ) : (
              <>
                <InterlayLink
                  className='hover:no-underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://testnet-faucet.mempool.co'>
                  <InterlayCaliforniaOutlinedButton
                    className={SMALL_SIZE_BUTTON_CLASS_NAME}
                    endIcon={
                      <ExternalLinkIcon
                        className={clsx(
                          'w-4',
                          'h-4',
                          'ml-1'
                        )} />
                    }>
                    {t('request_btc')}
                  </InterlayCaliforniaOutlinedButton>
                </InterlayLink>
                <InterlayDenimOutlinedButton
                  className={SMALL_SIZE_BUTTON_CLASS_NAME}
                  pending={isRequestPending}
                  onClick={requestDOT}>
                  {t('request_dot')}
                </InterlayDenimOutlinedButton>
                <Balances
                  collateralTokenBalance={collateralTokenBalance}
                  wrappedTokenBalance={wrappedTokenBalance} />
                <InterlayDefaultContainedButton
                  className={SMALL_SIZE_BUTTON_CLASS_NAME}
                  onClick={handleAccountModalOpen}>
                  {accountLabel}
                </InterlayDefaultContainedButton>
              </>
            )}
          </>
        )}
      </div>
      <AccountModal
        open={showAccountModal}
        onClose={handleAccountModalClose} />
    </>
  );
};

export default Topbar;
