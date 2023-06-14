import { PlusCircle } from '@/assets/icons';
import { Divider, FlexProps } from '@/component-library';

import { StyledBackground, StyledCircle, StyledWrapper } from './PlusDivider.styles';

type PlusDividerProps = FlexProps;

const PlusDivider = (props: PlusDividerProps): JSX.Element => (
  <StyledWrapper direction='column' justifyContent='center' {...props}>
    <Divider orientation='horizontal' color='default' />
    <StyledBackground />
    <StyledCircle>
      <PlusCircle color='secondary' strokeWidth={2} />
    </StyledCircle>
  </StyledWrapper>
);

export { PlusDivider };
export type { PlusDividerProps };
