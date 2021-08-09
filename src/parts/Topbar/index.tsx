
// ray test touch <<
import * as React from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { web3Accounts } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import AccountModal from 'parts/AccountModal';
import Balances from 'common/components/balances';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayDefaultContainedButton from 'components/buttons/InterlayDefaultContainedButton';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { showAccountModalAction } from 'common/actions/general.actions';
import { StoreType } from 'common/types/util.types';

const Topbar = (): JSX.Element => {
  const {
    extensions,
    address,
    polkaBtcLoaded,
    balanceDOT,
    balanceInterBTC,
    showAccountModal
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // ray test touch <<
  const handleRequestDotFromFaucet = async (): Promise<void> => {
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
    }
  };
  // ray test touch >>

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
    if (!polkaBtcLoaded) return;
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
      {address !== undefined && (
        <>
          {address === '' ? (
            <InterlayDefaultContainedButton onClick={handleAccountModalOpen}>
              {accountLabel}
            </InterlayDefaultContainedButton>
          ) : (
            <>
              <InterlayLink
                target='_blank'
                rel='noopener noreferrer'
                href='https://testnet-faucet.mempool.co/'
                style={{ textDecoration: 'none' }}>
                <InterlayCaliforniaOutlinedButton>
                  {t('request_btc')}
                </InterlayCaliforniaOutlinedButton>
              </InterlayLink>
              <InterlayDenimOutlinedButton
                style={{
                  marginLeft: 8
                }}
                pending={isRequestPending}
                onClick={requestDOT}>
                {t('request_dot')}
              </InterlayDenimOutlinedButton>
              <Balances
                balanceDOT={balanceDOT}
                balanceInterBTC={balanceInterBTC} />
              <InterlayDefaultContainedButton onClick={handleAccountModalOpen}>
                {accountLabel}
              </InterlayDefaultContainedButton>
            </>
          )}
        </>
      )}
      <AccountModal
        open={showAccountModal}
        onClose={handleAccountModalClose} />
    </>
  );
};

export default Topbar;
// ray test touch >>
