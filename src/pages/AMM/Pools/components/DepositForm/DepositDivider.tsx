import { PlusCircle } from '@/assets/icons';

import { StyledBackground, StyledCircle, StyledDivider, StyledWrapper } from './DepositForm.styles';

const DepositDivider = (): JSX.Element => (
  <StyledWrapper>
    <StyledDivider orientation='horizontal' color='tertiary' />
    <StyledBackground />
    <StyledCircle>
      <PlusCircle color='secondary' strokeWidth={2} />
    </StyledCircle>
  </StyledWrapper>
);

export { DepositDivider };
