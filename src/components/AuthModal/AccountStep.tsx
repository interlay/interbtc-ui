import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { DocumentDuplicate } from '@/assets/icons';
import { shortAddress } from '@/common/utils/utils';
import { Divider, Flex, P, Span, WalletIcon } from '@/component-library';
import { WalletData } from '@/utils/constants/wallets';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { StyledAccountItem, StyledCopyItem, StyledCTA } from './AuthModal.style';
import { AuthModalSteps } from './type';

type AccountStepProps = {
  wallet?: WalletData;
  accounts: InjectedAccountWithMeta[];
  onChangeWallet?: () => void;
} & StepComponentProps;

const AccountComponent = ({ accounts, wallet, onChangeWallet }: AccountStepProps): JSX.Element | null => {
  if (!wallet) {
    return null;
  }

  const walletAccounts = accounts.filter(({ meta: { source } }) => source === wallet.extensionName);

  return (
    <Flex direction='column' marginTop='spacing6'>
      <Divider color='default' />
      <Flex alignItems='center' justifyContent='space-between' gap='spacing4' marginY='spacing3'>
        <Flex gap='spacing2' alignItems='center'>
          <WalletIcon name={wallet.extensionName} />
          <P>
            Connected with <Span color='secondary'>{wallet.title}</Span>
          </P>
        </Flex>
        <StyledCTA size='small' variant='text' onPress={onChangeWallet}>
          Change Wallet
        </StyledCTA>
      </Flex>
      <Divider color='default' />
      <Flex elementType='ul' direction='column' gap='spacing4' marginTop='spacing6'>
        {walletAccounts.map((account) => {
          return (
            <Flex key={wallet.extensionName} elementType='li' gap='spacing4'>
              <StyledAccountItem flex={1} gap='spacing1' direction='column'>
                <P>{account.meta.name}</P>
                <P>({shortAddress(account.address)})</P>
              </StyledAccountItem>
              <StyledCopyItem>
                <DocumentDuplicate />
              </StyledCopyItem>
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
