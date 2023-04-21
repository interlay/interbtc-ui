import { InjectedExtension } from '@polkadot/extension-inject/types';

import { ArrowRight, ArrowTopRightOnSquare } from '@/assets/icons';
import { Flex, WalletIcon } from '@/component-library';
import { KeyringPair } from '@/lib/substrate';
import { WalletData, WALLETS } from '@/utils/constants/wallets';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { AuthListItem } from './AuthListItem';
import { AuthModalSteps } from './type';

type WalletStepProps = {
  onSelectionChange?: (wallet: WalletData) => void;
  extensions: InjectedExtension[];
  selectedAccount?: KeyringPair;
} & StepComponentProps;

const WalletComponent = ({ extensions, onSelectionChange }: WalletStepProps): JSX.Element => (
  <Flex elementType='ul' direction='column' gap='spacing4' marginTop='spacing6'>
    {WALLETS.map((wallet) => {
      const isInstalled = extensions.find((extension) => extension.name === wallet.extensionName);

      const handlePress = () => {
        if (isInstalled) {
          onSelectionChange?.(wallet);
        } else {
          window.open(wallet.url, '_blank', 'noopener');
        }
      };

      return (
        <AuthListItem
          elementType='li'
          gap='spacing4'
          alignItems='center'
          justifyContent='space-between'
          key={wallet.extensionName}
          onPress={handlePress}
        >
          <Flex gap='spacing2' alignItems='center'>
            <WalletIcon name={wallet.extensionName} />
            {wallet.title}
          </Flex>
          {isInstalled ? <ArrowRight /> : <ArrowTopRightOnSquare />}
        </AuthListItem>
      );
    })}
  </Flex>
);

const WalletStep = withStep<WalletStepProps>(WalletComponent, AuthModalSteps.WALLET);

export { WalletStep };
