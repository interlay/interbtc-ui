
import {
  Button,
  Modal
} from 'react-bootstrap';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';
import { StoreType } from 'common/types/util.types';
import { showAccountModalAction } from 'common/actions/general.actions';

type Props = {
  selectAccount: (account: string) => void | Promise<void>;
  selectedAccount?: string;
};

const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';

function AccountModal({
  selectAccount,
  selectedAccount
}: Props): JSX.Element {
  const {
    showAccountModal,
    accounts,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClose = () => dispatch(showAccountModalAction(false));

  const handleAccountSelect = (account: string) => () => {
    selectAccount(account);
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
              <p className='mb-4'>
                {t('no_account')}
                <InterlayLink
                  href={POLKADOT_EXTENSION}
                  target='_blank'
                  rel='noopener noreferrer'>
                  &nbsp;{t('here')}
                </InterlayLink>
                .
              </p>
            )}
            {/* List all available accounts */}
            <ul className='space-y-4'>
              {accounts?.map((account: string) => (
                <li
                  key={account}
                  className={clsx(
                    'font-bold',
                    'p-4',
                    'rounded',
                    'border',
                    'border-solid',
                    'shadow-sm',
                    'cursor-pointer',
                    'hover:bg-interlayRose',
                    'hover:text-white'
                  )}
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
            <p className='mb-4'>
              {t('install_supported_wallets')}
            </p>
            <InterlayLink
              className={clsx(
                'flex',
                'items-center',
                'px-4',
                'py-2.5',
                'rounded',
                'shadow-sm',
                'border',
                'border-solid',
                'border-interlayRose',
                'w-1/2'
              )}
              href={POLKADOT_EXTENSION}
              target='_blank'
              rel='noopener noreferrer'>
              <PolkadotExtensionLogoIcon
                width={30}
                height={30} />
              <span style={{ marginLeft: 16 }}>Polkadot.js</span>
            </InterlayLink>
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
