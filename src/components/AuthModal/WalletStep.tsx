import { InjectedExtension } from '@polkadot/extension-inject/types';

import { ArrowTopRightOnSquare } from '@/assets/icons';
import { Flex, WalletIcon } from '@/component-library';
import { WalletData, WALLETS } from '@/utils/constants/wallets';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { StyledArrowRight, StyledWalletItem } from './AuthModal.style';
import { AuthModalSteps } from './type';

type WalletStepProps = {
  onSelectionChange?: (wallet: WalletData) => void;
  extensions: InjectedExtension[];
  selectedWallet?: WalletData;
} & StepComponentProps;

const WalletComponent = ({ extensions, selectedWallet, onSelectionChange }: WalletStepProps): JSX.Element => {
  const wallets = WALLETS.map((wallet) => ({
    isInstalled: extensions.find((extension) => extension.name === wallet.extensionName),
    data: wallet
  })).sort((a, b) => (a.isInstalled === b.isInstalled ? 0 : b.isInstalled ? 1 : -1));

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

        const isSelected = selectedWallet?.extensionName === data.extensionName;

        return (
          <StyledWalletItem
            elementType='li'
            gap='spacing4'
            alignItems='center'
            justifyContent='space-between'
            key={data.extensionName}
            onPress={handlePress}
            isSelected={isSelected}
            aria-label={isInstalled ? `select ${data.title} wallet` : `navigate to ${data.title} extension page`}
          >
            <Flex gap='spacing2' alignItems='center'>
              <WalletIcon name={data.extensionName} />
              {data.title}
            </Flex>
            {isInstalled ? <StyledArrowRight $isSelected={isSelected} /> : <ArrowTopRightOnSquare />}
          </StyledWalletItem>
        );
      })}
    </Flex>
  );
};

const WalletStep = withStep<WalletStepProps>(WalletComponent, AuthModalSteps.WALLET);

export { WalletStep };
