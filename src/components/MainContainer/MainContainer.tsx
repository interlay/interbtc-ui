import { FlexProps } from '@/component-library';

import { StyledContainer } from './MainContainer.styles';

type MainContainerProps = FlexProps;

const MainContainer = ({ direction = 'column', gap = 'spacing8', ...props }: MainContainerProps): JSX.Element => (
  <StyledContainer direction={direction} gap={gap} {...props} />
);

export { MainContainer };
