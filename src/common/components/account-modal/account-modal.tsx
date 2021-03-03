
import React, { ReactElement } from 'react';
import {
  Button,
  Modal
} from 'react-bootstrap';
import {
  useDispatch,
  useSelector,
  useStore
} from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ReactComponent as PolkadotExtensionLogo } from 'assets/img/polkadot-extension-logo.svg';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';
import fetchIssueTransactions from 'common/live-data/issue-transaction.watcher';
import './account-modal.scss';

type Props = {
  selectAccount: (account: string) => void | Promise<void>;
  selectedAccount?: string;
};

const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';

function AccountModal({
  selectAccount,
  selectedAccount
}: Props): ReactElement {
  const {
    showAccountModal,
    accounts,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const store = useStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClose = () => dispatch(showAccountModalAction(false));

  const handleAccountSelect = (account: string) => () => {
    selectAccount(account);
    fetchIssueTransactions(dispatch, store);
  };

  return (
    <Modal
      show={showAccountModal}
      onHide={handleClose}
      size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>
          {extensions.length ? 'Select account' : 'Pick a wallet'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='account-modal'>
        {extensions.length ? (
          <>
            {/* Create a new account when no accounts are available */}
            {!accounts?.length && (
              <p>
                {t('no_account')}
                <a
                  href={POLKADOT_EXTENSION}
                  target='_blank'
                  rel='noopener noreferrer'>
                  &nbsp;{t('here')}
                </a>
                .
              </p>
            )}
            {/* List all available accounts */}
            <ul>
              {accounts?.map((account: string) => (
                <li
                  key={account}
                  className='account-item'
                  // TODO: should use a button for semantic HTML usage
                  onClick={handleAccountSelect(account)}>
                  {account}
                  &nbsp;
                  {selectedAccount === account ? '(selected)' : ''}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p>
              {t('install_supported_wallets')}
            </p>
            <a
              className='polkadot-extension-link'
              href={POLKADOT_EXTENSION}
              target='_blank'
              rel='noopener noreferrer'>
              <PolkadotExtensionLogo
                width={30}
                height={30} />
              <span style={{ marginLeft: 16 }}>Polkadot.js</span>
            </a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AccountModal;
