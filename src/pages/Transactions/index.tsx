import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { SUBSCAN_LINK } from '@/config/relay-chains';
import ExternalLink from '@/legacy-components/ExternalLink';
import { useSubstrateSecureState } from '@/lib/substrate';
import MainContainer from '@/parts/MainContainer';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import IssueRequestsTable from './IssueRequestsTable';
import RedeemRequestsTable from './RedeemRequestsTable';

const Transactions = (): JSX.Element => {
  const { selectedAccount } = useSubstrateSecureState();
  const { t } = useTranslation();

  return (
    <MainContainer
      className={clsx(
        { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
      )}
    >
      <IssueRequestsTable />
      <RedeemRequestsTable />
      {selectedAccount && (
        <ExternalLink href={`${SUBSCAN_LINK}/account/${selectedAccount.address}`} className='font-medium'>
          {t('view_all_transactions_on_subscan')}
        </ExternalLink>
      )}
    </MainContainer>
  );
};

export default Transactions;
