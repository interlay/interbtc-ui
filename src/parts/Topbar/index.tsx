
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

import Tokens from 'components/Tokens';
import AccountModal from 'parts/AccountModal';
import InterlayLink from 'components/UI/InterlayLink';
import
InterlayDenimOrKintsugiMidnightOutlinedButton from
  'components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';
import { GOVERNANCE_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import { showAccountModalAction } from 'common/actions/general.actions';
import { StoreType } from 'common/types/util.types';
// FIXME: name clash for constants so had to use relative path
import * as constants from '../../constants';
import { BitcoinNetwork } from 'types/bitcoin';

// TODO: could create a specific prop
const SMALL_SIZE_BUTTON_CLASSES = clsx(
  'leading-7',
  '!px-3'
);

const Topbar = (): JSX.Element => {
  // ray test touch <
  const {
    extensions,
    address,
    bridgeLoaded,
    showAccountModal
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRequestFromFaucet = async (): Promise<void> => {
    if (!address) return;

    try {
      const receiverId = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId, GOVERNANCE_TOKEN_ID_LITERAL);
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
        const theAccounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
        setAccounts(theAccounts);
      } catch (error) {
        // TODO: should add error handling properly
        console.log('[Topbar] error.message => ', error.message);
      }
    })();
  }, [extensions.length]);

  const requestFunds = async () => {
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
                className={SMALL_SIZE_BUTTON_CLASSES}
                onClick={handleAccountModalOpen}>
                {accountLabel}
              </InterlayDefaultContainedButton>
            ) : (
              <>
                {process.env.REACT_APP_BITCOIN_NETWORK !== BitcoinNetwork.Mainnet && (
                  <>
                    <InterlayLink
                      className='hover:no-underline'
                      target='_blank'
                      rel='noopener noreferrer'
                      href='https://bitcoinfaucet.uo1.net'>
                      <InterlayCaliforniaOutlinedButton
                        className={SMALL_SIZE_BUTTON_CLASSES}
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
                    <InterlayDenimOrKintsugiMidnightOutlinedButton
                      className={SMALL_SIZE_BUTTON_CLASSES}
                      pending={isRequestPending}
                      onClick={requestFunds}>
                      {t('request_funds', {
                        tokenSymbol: GOVERNANCE_TOKEN_SYMBOL
                      })}
                    </InterlayDenimOrKintsugiMidnightOutlinedButton>
                  </>
                )}
                <Tokens />
                <InterlayDefaultContainedButton
                  className={SMALL_SIZE_BUTTON_CLASSES}
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
