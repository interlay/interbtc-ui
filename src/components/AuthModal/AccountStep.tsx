import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';

import { DocumentDuplicate } from '@/assets/icons';
import { shortAddress } from '@/common/utils/utils';
import { CTA, Divider, Flex, P, Span, Tooltip, WalletIcon } from '@/component-library';
import { KeyringPair } from '@/lib/substrate';
import { WalletData } from '@/utils/constants/wallets';
import { StepComponentProps, withStep } from '@/utils/hocs/step';
import { useCopyTooltip } from '@/utils/hooks/use-copy-tooltip';

import { StyledAccountItem, StyledCopyItem, StyledP } from './AuthModal.style';
import { AuthModalSteps } from './types';

type CopyAddressProps = { account: InjectedAccountWithMeta };

const CopyAddress = ({ account }: CopyAddressProps) => {
  const [, copy] = useCopyToClipboard();
  const { buttonProps, tooltipProps } = useCopyTooltip();

  const handleCopy = () => copy(account.address);

  return (
    <Tooltip {...tooltipProps}>
      <StyledCopyItem
        {...mergeProps(buttonProps, { onPress: handleCopy })}
        aria-label={`copy ${`${account.meta.name} address` || shortAddress(account.address)} to clipboard`}
        elementType='div'
      >
        <DocumentDuplicate />
      </StyledCopyItem>
    </Tooltip>
  );
};

type AccountStepProps = {
  accounts: InjectedAccountWithMeta[];
  wallet: WalletData;
  selectedAccount?: KeyringPair;
  onChangeWallet?: () => void;
  onSelectionChange: (account: InjectedAccountWithMeta) => void;
} & StepComponentProps;

const AccountComponent = ({
  accounts,
  wallet,
  selectedAccount,
  onChangeWallet,
  onSelectionChange
}: AccountStepProps): JSX.Element | null => {
  const { t } = useTranslation();

  const walletAccounts = accounts.filter(({ meta: { source } }) => source === wallet.extensionName);

  return (
    <Flex direction='column' marginTop='spacing6'>
      <Divider color='default' />
      <Flex alignItems='center' justifyContent='space-between' gap='spacing4' marginY='spacing3'>
        <Flex gap='spacing2' alignItems='center'>
          <WalletIcon name={wallet.extensionName} />
          <P>
            {t('account_modal.connected_with')} <Span color='secondary'>{wallet.title}</Span>
          </P>
        </Flex>
        <CTA size='small' variant='outlined' onPress={onChangeWallet}>
          {t('account_modal.change_wallet')}
        </CTA>
      </Flex>
      <Divider color='default' />
      <Flex elementType='ul' direction='column' gap='spacing4' marginTop='spacing6'>
        {walletAccounts.map((account) => {
          const isSelected = selectedAccount?.address === account.address;

          return (
            <Flex key={account.address} elementType='li' gap='spacing4'>
              <StyledAccountItem
                flex={1}
                gap='spacing1'
                direction='column'
                elementType='div'
                onPress={() => onSelectionChange(account)}
                isSelected={isSelected}
              >
                <StyledP weight='bold' $isSelected={isSelected}>
                  {account.meta.name}
                </StyledP>
                <StyledP $isSelected={isSelected}>({shortAddress(account.address)})</StyledP>
              </StyledAccountItem>
              <CopyAddress account={account} />
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

const AccountStep = withStep<AccountStepProps>(AccountComponent, AuthModalSteps.ACCOUNT);

export { AccountStep };
export type { AccountStepProps };
