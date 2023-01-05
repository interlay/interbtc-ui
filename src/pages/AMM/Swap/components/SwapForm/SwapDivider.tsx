import { ArrowsUpDown } from '@/assets/icons';

import { StyledCircle, StyledDivider, StyledWrapper } from './SwapForm.style';

const SwapDivider = (): JSX.Element | null => (
  <StyledWrapper>
    <StyledDivider orientation='horizontal' color='tertiary' />
    <StyledCircle>
      <ArrowsUpDown color='secondary' strokeWidth={2} />
    </StyledCircle>
  </StyledWrapper>
);

export { SwapDivider };
