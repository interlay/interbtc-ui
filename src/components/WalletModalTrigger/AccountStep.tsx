import { mergeProps } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';

import { DocumentDuplicate } from '@/assets/icons';
import { shortAddress } from '@/common/utils/utils';
import { CTA, Divider, Flex, P, Span, Tooltip, WalletIcon } from '@/component-library';
import { useCopyTooltip } from '@/hooks/use-copy-tooltip';
import { WalletAccountData, WalletData } from '@/lib/wallet/types';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { StyledAccountItem, StyledCopyItem, StyledP } from './AuthModal.style';
import { AuthModalSteps } from './types';

type CopyAddressProps = { account: WalletAccountData };

const CopyAddress = ({ account }: CopyAddressProps) => {
  const [, copy] = useCopyToClipboard();
  const { buttonProps, tooltipProps } = useCopyTooltip();

  const handleCopy = () => copy(account.address);

  return (
    <Tooltip {...tooltipProps}>
      <StyledCopyItem
        {...mergeProps(buttonProps, { onPress: handleCopy })}
        aria-label={`copy ${`${account.name} address` || shortAddress(account.address)} to clipboard`}
        elementType='div'
      >
        <DocumentDuplicate />
      </StyledCopyItem>
    </Tooltip>
  );
};

type AccountStepProps = {
  value?: WalletAccountData;
  accounts: WalletAccountData[];
  wallet: WalletData;
  onChangeWallet?: () => void;
  onSelectionChange: (account: WalletAccountData) => void;
} & StepComponentProps;

const AccountComponent = ({
  value,
  accounts,
  wallet,
  onChangeWallet,
  onSelectionChange
}: AccountStepProps): JSX.Element | null => {
  const { t } = useTranslation();

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
        {accounts.map((account) => {
          const isSelected = value?.address === account.address;

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
                  {account.name}
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
