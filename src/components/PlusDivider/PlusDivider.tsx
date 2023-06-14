import { PlusCircle } from '@/assets/icons';
import { Divider } from '@/component-library';

import { StyledBackground, StyledCircle, StyledWrapper } from './PlusDivider.styles';

const PlusDivider = (): JSX.Element => (
  <StyledWrapper>
    <Divider marginY='spacing5' orientation='horizontal' color='default' />
    <StyledBackground />
    <StyledCircle>
      <PlusCircle color='secondary' strokeWidth={2} />
    </StyledCircle>
  </StyledWrapper>
);

export { PlusDivider };
