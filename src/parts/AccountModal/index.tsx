
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

import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import IconButton from 'components/buttons/IconButton';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import { APP_NAME } from 'config/relay-chains';
import { StoreType } from 'common/types/util.types';
import { changeAddressAction } from 'common/actions/general.actions';
import { shortAddress } from 'common/utils/utils';
import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';
import { ReactComponent as CloseIcon } from 'assets/img/icons/close.svg';

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
        <IconButton
          ref={focusRef}
          className={clsx(
            'w-12',
            'h-12',
            'absolute',
            'top-3',
            'right-3'
          )}
          onClick={onClose}>
          <CloseIcon
            width={18}
            height={18}
            className='text-interlaySecondaryInLightMode' />
        </IconButton>
        <div className='space-y-4'>
          {extensions.length ? (
            <>
              {/* Create a new account when no accounts are available */}
              {!accounts?.length && (
                <p>
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
                  'border-interlayDenim',
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
