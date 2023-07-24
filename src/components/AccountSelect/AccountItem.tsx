import Identicon from '@polkadot/react-identicon';

import { FlexProps } from '@/component-library/Flex';

import { StyledAccountItemAddress, StyledAccountItemName, StyledAccountItemWrapper } from './AccountSelect.style';

type Props = {
  isSelected?: boolean;
  address: string;
  name?: string;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type AccountItemProps = Props & InheritAttrs;

const AccountItem = ({ isSelected, address, name, ...props }: AccountItemProps): JSX.Element => (
  <StyledAccountItemWrapper alignItems='center' gap='spacing2' flex='1' {...props}>
    <Identicon size={24} value={address} theme='polkadot' />
    <StyledAccountItemWrapper direction='column'>
      {name && (
        <StyledAccountItemName size='s' $isSelected={!!isSelected}>
          {name}
        </StyledAccountItemName>
      )}
      <StyledAccountItemAddress size='xs' color='tertiary'>
        {address}
      </StyledAccountItemAddress>
    </StyledAccountItemWrapper>
  </StyledAccountItemWrapper>
);

export { AccountItem };
export type { AccountItemProps };
