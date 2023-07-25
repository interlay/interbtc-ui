import Identicon from '@polkadot/react-identicon';

import { FlexProps } from '@/component-library/Flex';
import { useSelectModalContext } from '@/component-library/Select/SelectModalContext';

import { StyledAccountItemAddress, StyledAccountItemName, StyledAccountItemWrapper } from './AccountSelect.style';

type Props = {
  address: string;
  name?: string;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type AccountItemProps = Props & InheritAttrs;

const AccountItem = ({ address, name, ...props }: AccountItemProps): JSX.Element => {
  const isSelected = useSelectModalContext().selectedItem?.key === address;

  return (
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
};

export { AccountItem };
export type { AccountItemProps };
