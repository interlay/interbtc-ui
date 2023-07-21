import Identicon from '@polkadot/react-identicon';

import { FlexProps } from '@/component-library/Flex';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';

import { StyledAccountLabelAddress, StyledAccountLabelName, StyledAccountLabelWrapper } from './AccountItem.style';

type Props = {
  address: string;
  name?: string;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type AccountLabelProps = Props & InheritAttrs;

const AccountItem = ({ address, name }: AccountLabelProps): JSX.Element => {
  const isSelected = useSelectModalContext().selectedItem?.key === address;

  return (
    <StyledAccountLabelWrapper alignItems='center' gap='spacing2' flex='1'>
      <Identicon size={24} value={address} theme='polkadot' />
      <StyledAccountLabelWrapper direction='column'>
        <StyledAccountLabelName size='s' $isSelected={!!isSelected}>
          {name}
        </StyledAccountLabelName>
        <StyledAccountLabelAddress size='xs' color='tertiary'>
          {address}
        </StyledAccountLabelAddress>
      </StyledAccountLabelWrapper>
    </StyledAccountLabelWrapper>
  );
};

export { AccountItem };
export type { AccountLabelProps };
