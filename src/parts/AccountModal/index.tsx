
import * as React from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  web3Enable,
  web3FromAddress,
  web3Accounts
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import ExternalLink from 'components/ExternalLink';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import { APP_NAME } from 'config/relay-chains';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { changeAddressAction } from 'common/actions/general.actions';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';

const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AccountModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    extensions
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const focusRef = React.useRef(null);

  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>();

  React.useEffect(() => {
    if (!extensions.length) return;

    (async () => {
      try {
        const theAccounts = await web3Accounts();
        setAccounts(theAccounts);
      } catch (error) {
        // TODO: should add error handling properly
        console.log('[AccountModal] error.message => ', error.message);
      }
    })();
  }, [extensions.length]);

  const handleAccountSelect = (newAddress: string) => async () => {
    if (!bridgeLoaded) {
      return;
    }

    // TODO: should check when the app being initialized (not check everywhere)
    await web3Enable(APP_NAME);
    const { signer } = await web3FromAddress(newAddress);
    window.bridge.interBtcApi.setAccount(newAddress, signer);
    dispatch(changeAddressAction(newAddress));

    onClose();
  };

  return (
    <InterlayModal
      initialFocus={focusRef}
      open={open}
      onClose={onClose}>
      <InterlayModalInnerWrapper
        className={clsx(
          'p-6',
          'max-w-lg'
        )}>
        <InterlayModalTitle
          as='h3'
          className={clsx(
            'text-lg',
            'font-medium',
            'mb-4'
          )}>
          {extensions.length ? 'Select account' : 'Pick a wallet'}
        </InterlayModalTitle>
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <div className='space-y-4'>
          {extensions.length ? (
            <>
              {/* Create a new account when no accounts are available */}
              {!accounts?.length && (
                <p>
                  {t('no_account')}
                  <ExternalLink href={POLKADOT_EXTENSION}>
                    &nbsp;{t('here')}
                  </ExternalLink>
                  .
                </p>
              )}
              {/* List all available accounts */}
              <ul className='space-y-4'>
                {accounts?.map(account => (
                  <li
                    key={account.address}
                    className={clsx(
                      'rounded',
                      'border',
                      'border-solid',
                      'shadow-sm',
                      'hover:bg-gray-100'
                    )}>
                    <button
                      className={clsx(
                        'p-4',
                        'flex',
                        'items-center',
                        'space-x-1.5',
                        'w-full'
                      )}
                      onClick={handleAccountSelect(account.address)}>
                      <span
                        className={clsx(
                          'rounded-full',
                          'h-3',
                          'w-3',
                          'inline-block',
                          address === account.address ? 'bg-green-500' : 'bg-transparent'
                        )} />
                      <span className='font-medium'>
                        {account.meta.name}
                      </span>
                      <span>
                        {`(${shortAddress(account.address)})`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p>
                {t('install_supported_wallets')}
              </p>
              <ExternalLink
                className={clsx(
                  'px-4',
                  'py-2.5',
                  'rounded',
                  'shadow-sm',
                  'border',
                  'border-solid'
                )}
                href={POLKADOT_EXTENSION}>
                <div
                  className={clsx(
                    'inline-flex',
                    'items-center',
                    'space-x-1.5'
                  )}>
                  <PolkadotExtensionLogoIcon
                    width={30}
                    height={30} />
                  <span>Polkadot.js</span>
                </div>
              </ExternalLink>
            </>
          )}
          <div
            className={clsx(
              'flex',
              'justify-end'
            )}>
            <InterlayMulberryOutlinedButton onClick={onClose}>
              Close
            </InterlayMulberryOutlinedButton>
          </div>
        </div>
      </InterlayModalInnerWrapper>
    </InterlayModal>
  );
};

export default AccountModal;
