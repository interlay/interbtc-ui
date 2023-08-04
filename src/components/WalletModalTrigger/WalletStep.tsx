import { ArrowTopRightOnSquare } from '@/assets/icons';
import { Flex, WalletIcon } from '@/component-library';
import { WalletData } from '@/lib/wallet/types';
import { StepComponentProps, withStep } from '@/utils/hocs/step';

import { StyledArrowRight, StyledWalletItem } from './AuthModal.style';
import { AuthModalSteps } from './types';

type WalletStepProps = {
  onSelectionChange?: (wallet: WalletData) => void;
  wallets: WalletData[];
  value?: WalletData;
} & StepComponentProps;

const WalletComponent = ({ wallets, value, onSelectionChange }: WalletStepProps): JSX.Element => {
  const sortedWallets = wallets.sort((a, b) => (a.installed === b.installed ? 0 : b.installed ? 1 : -1));

  return (
    <Flex elementType='ul' direction='column' gap='spacing4' marginTop='spacing6'>
      {sortedWallets.map((wallet) => {
        const isInstalled = wallet.installed;

        const handlePress = () => {
          if (isInstalled) {
            onSelectionChange?.(wallet);
          } else {
            window.open(wallet.installUrl, '_blank', 'noopener');
          }
        };

        const isSelected = value?.extensionName === wallet.extensionName;

        return (
          <StyledWalletItem
            elementType='li'
            gap='spacing4'
            alignItems='center'
            justifyContent='space-between'
            key={wallet.extensionName}
            onPress={handlePress}
            isSelected={isSelected}
            aria-label={isInstalled ? `select ${wallet.title} wallet` : `navigate to ${wallet.title} extension page`}
          >
            <Flex gap='spacing2' alignItems='center'>
              <WalletIcon name={wallet.extensionName} />
              {wallet.title}
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
