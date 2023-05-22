import Identicon from '@polkadot/react-identicon';

import { FlexProps } from '@/component-library/Flex';

import { StyledAccountLabelAddress, StyledAccountLabelName, StyledAccountLabelWrapper } from './AccountSelect.style';

type Props = {
  isSelected?: boolean;
  address: string;
  name?: string;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type AccountLabelProps = Props & InheritAttrs;

const AccountLabel = ({ isSelected, address, name, ...props }: AccountLabelProps): JSX.Element => (
  <StyledAccountLabelWrapper alignItems='center' gap='spacing2' flex='1' {...props}>
    <Identicon size={24} value={address} theme='polkadot' />
    <StyledAccountLabelWrapper direction='column'>
      {name && (
        <StyledAccountLabelName size='s' $isSelected={!!isSelected}>
          {name}
        </StyledAccountLabelName>
      )}
      <StyledAccountLabelAddress size='xs' color='tertiary'>
        {address}
      </StyledAccountLabelAddress>
    </StyledAccountLabelWrapper>
  </StyledAccountLabelWrapper>
);

export { AccountLabel };
export type { AccountLabelProps };
