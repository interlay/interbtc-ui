import { InjectedExtension } from '@polkadot/extension-inject/types';

import { ArrowRight, ArrowTopRightOnSquare } from '@/assets/icons';
import { Flex, WalletIcon } from '@/component-library';
import { KeyringPair } from '@/lib/substrate';
import { WalletData, WALLETS } from '@/utils/constants/wallets';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { StyledWalletItem } from './AuthModal.style';
import { AuthModalSteps } from './type';

type WalletStepProps = {
  onSelectionChange?: (wallet: WalletData) => void;
  extensions: InjectedExtension[];
  selectedAccount?: KeyringPair;
} & StepComponentProps;

const WalletComponent = ({ extensions, onSelectionChange }: WalletStepProps): JSX.Element => {
  const wallets = WALLETS.map((wallet) => ({
    isInstalled: extensions.find((extension) => extension.name === wallet.extensionName),
    data: wallet
  })).sort((a, b) => (a === b ? 0 : b ? -1 : 1));

  return (
    <Flex elementType='ul' direction='column' gap='spacing4' marginTop='spacing6'>
      {wallets.map(({ data, isInstalled }) => {
        const handlePress = () => {
          if (isInstalled) {
            onSelectionChange?.(data);
          } else {
            window.open(data.url, '_blank', 'noopener');
          }
        };

        return (
          <StyledWalletItem
            elementType='li'
            gap='spacing4'
            alignItems='center'
            justifyContent='space-between'
            key={data.extensionName}
            onPress={handlePress}
          >
            <Flex gap='spacing2' alignItems='center'>
              <WalletIcon name={data.extensionName} />
              {data.title}
            </Flex>
            {isInstalled ? <ArrowRight /> : <ArrowTopRightOnSquare />}
          </StyledWalletItem>
        );
      })}
    </Flex>
  );
};

const WalletStep = withStep<WalletStepProps>(WalletComponent, AuthModalSteps.WALLET);

export { WalletStep };
