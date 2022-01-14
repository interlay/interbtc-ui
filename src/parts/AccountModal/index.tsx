
import * as React from 'react';
// ray test touch <<
// import {
//   useDispatch,
//   useSelector
// } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// ray test touch >>
import clsx from 'clsx';
// ray test touch <<
// import {
//   web3Enable,
//   web3FromAddress,
//   web3Accounts
// } from '@polkadot/extension-dapp';
// ray test touch >>
// ray test touch <<
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { useSubstrate } from 'substrate-lib';
// ray test touch >>

// ray test touch <<
// import ExternalLink from 'components/ExternalLink';
// ray test touch >>
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import CloseIconButton from 'components/buttons/CloseIconButton';
import InterlayModal, {
  InterlayModalInnerWrapper,
  InterlayModalTitle
} from 'components/UI/InterlayModal';
import InterlayButtonBase from 'components/UI/InterlayButtonBase';
// ray test touch <<
// import { APP_NAME } from 'config/relay-chains';
// ray test touch >>
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';
// ray test touch <<
// import { StoreType } from 'common/types/util.types';
// import { changeAddressAction } from 'common/actions/general.actions';
// import { ReactComponent as PolkadotExtensionLogoIcon } from 'assets/img/polkadot-extension-logo.svg';
// const POLKADOT_EXTENSION = 'https://polkadot.js.org/extension/';
// ray test touch >>

interface Props {
  open: boolean;
  onClose: () => void;
}

// ray test touch <<
interface KeyringOption {
  id: string;
  name: string;
  value: string;
}
// ray test touch >>

const AccountModal = ({
  open,
  onClose
}: Props): JSX.Element => {
  // ray test touch <<
  // const {
  //   bridgeLoaded,
  //   address,
  //   extensions
  // } = useSelector((state: StoreType) => state.general);
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // ray test touch >>
  const focusRef = React.useRef(null);

  // ray test touch <<
  const {
    state: { keyring },
    selectedAccountAddress,
    setSelectedAccountAddress
  } = useSubstrate();

  // Get the list of accounts we possess the private key for
  const keyringOptions = React.useMemo(() => {
    return keyring.getPairs().map((account: KeyringPair) => ({
      id: account.address,
      name: (account.meta.name as string).toUpperCase(),
      value: account.address
    }));
  }, [keyring]);

  React.useEffect(() => {
    if (!keyringOptions) return;
    if (!setSelectedAccountAddress) return;

    if (!selectedAccountAddress) {
      setSelectedAccountAddress(keyringOptions[0].value);
    }
  }, [
    selectedAccountAddress,
    keyringOptions,
    setSelectedAccountAddress
  ]);
  // ray test touch >>

  // ray test touch <<
  // const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>();
  // const extensionWalletAvailable = extensions.length > 0;
  // React.useEffect(() => {
  //   if (!extensionWalletAvailable) return;
  //   (async () => {
  //     try {
  //       const theAccounts = await web3Accounts();
  //       setAccounts(theAccounts);
  //     } catch (error) {
  //       // TODO: should add error handling properly
  //       console.log('[AccountModal] error.message => ', error.message);
  //     }
  //   })();
  // }, [extensionWalletAvailable]);
  // ray test touch >>

  // ray test touch <<
  // const handleAccountSelect = (newAddress: string) => async () => {
  //   if (!bridgeLoaded) {
  //     return;
  //   }
  //   // TODO: should check when the app being initialized (not check everywhere)
  //   await web3Enable(APP_NAME);
  //   const { signer } = await web3FromAddress(newAddress);
  //   window.bridge.interBtcApi.setAccount(newAddress, signer);
  //   dispatch(changeAddressAction(newAddress));
  //   onClose();
  // };
  const handleAccountSelect = (newKeyringOption: KeyringOption) => () => {
    setSelectedAccountAddress(newKeyringOption.value);
    onClose();
  };
  // ray test touch >>

  // ray test touch <<
  // const renderContent = () => {
  //   if (extensionWalletAvailable) {
  //     return (
  //       <>
  //         {accounts !== undefined && accounts.length > 0 ? (
  //           // List all available accounts
  //           <ul className='space-y-4'>
  //             {accounts.map(account => {
  //               const selected = address === account.address;
  //               return (
  //                 <li
  //                   key={account.address}
  //                   className={clsx(
  //                     'rounded',
  //                     'border',
  //                     'border-solid',
  //                     'shadow-sm',
  //                     // TODO: could be reused
  //                     selected ? clsx(
  //                       { 'text-interlayDenim-700':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  //                       { 'dark:text-kintsugiMidnight-700':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  //                       { 'bg-interlayHaiti-50':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  //                       { 'dark:bg-white':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
  //                     ) : clsx(
  //                       { 'text-interlayTextPrimaryInLightMode':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  //                       // eslint-disable-next-line max-len
  //                       { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  //                       { 'hover:bg-interlayHaiti-50':
  //                         process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
  //                       { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  //                       { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
  //                     )
  //                   )}>
  //                   <InterlayButtonBase
  //                     className={clsx(
  //                       'px-5',
  //                       'py-3',
  //                       'space-x-1.5',
  //                       'w-full'
  //                     )}
  //                     onClick={handleAccountSelect(account.address)}>
  //                     <span className='font-medium'>
  //                       {account.meta.name}
  //                     </span>
  //                     <span>
  //                       {`(${shortAddress(account.address)})`}
  //                     </span>
  //                   </InterlayButtonBase>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         ) : (
  //           // Create a new account when no accounts are available
  //           <p>
  //             {t('no_account')}
  //             <ExternalLink href={POLKADOT_EXTENSION}>
  //               &nbsp;{t('here')}
  //             </ExternalLink>
  //             .
  //           </p>
  //         )}
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <p>
  //           {t('install_supported_wallets')}
  //         </p>
  //         <ExternalLink href={POLKADOT_EXTENSION}>
  //           <span
  //             className={clsx(
  //               'inline-flex',
  //               'items-center',
  //               'space-x-1.5'
  //             )}>
  //             <PolkadotExtensionLogoIcon
  //               width={30}
  //               height={30} />
  //             <span>Polkadot.js</span>
  //           </span>
  //         </ExternalLink>
  //       </>
  //     );
  //   }
  // };
  const renderContent = () => {
    return (
      // List all available accounts
      <ul className='space-y-4'>
        {keyringOptions.map((keyringOption: KeyringOption) => {
          const selected = selectedAccountAddress === keyringOption.value;
          return (
            <li
              key={keyringOption.value}
              className={clsx(
                'rounded',
                'border',
                'border-solid',
                'shadow-sm',
                // TODO: could be reused
                selected ? clsx(
                  { 'text-interlayDenim-700':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:text-kintsugiMidnight-700':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:bg-white':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                ) : clsx(
                  { 'text-interlayTextPrimaryInLightMode':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  // eslint-disable-next-line max-len
                  { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'hover:bg-interlayHaiti-50':
                    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                  { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
                  { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
                )
              )}>
              <InterlayButtonBase
                className={clsx(
                  'px-5',
                  'py-3',
                  'space-x-1.5',
                  'w-full'
                )}
                onClick={handleAccountSelect(keyringOption)}>
                <span className='font-medium'>
                  {keyringOption.name}
                </span>
                <span>
                  {`(${shortAddress(keyringOption.value)})`}
                </span>
              </InterlayButtonBase>
            </li>
          );
        })}
      </ul>
    );
  };
  // ray test touch >>

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
            'mb-6'
          )}>
          {/* ray test touch << */}
          {/* {extensionWalletAvailable ?
            'Select account' :
            'Pick a wallet'
          } */}
          {/* ray test touch >> */}
        </InterlayModalTitle>
        <CloseIconButton
          ref={focusRef}
          onClick={onClose} />
        <div className='space-y-4'>
          {renderContent()}
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
