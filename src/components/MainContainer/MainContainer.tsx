import { FlexProps } from '@/component-library';
import { SiteInformation } from '@/components';

import { StyledContainer } from './MainContainer.styles';

type MainContainerProps = FlexProps;

const MainContainer = ({ direction = 'column', gap = 'spacing8', ...props }: MainContainerProps): JSX.Element => {
  const showGlobalWarningMessage = !!process.env.REACT_APP_SITE_INFORMATION_MESSAGE;

  return (
    <StyledContainer direction={direction} gap={gap} {...props}>
      {showGlobalWarningMessage && <SiteInformation />}
      {props.children}
    </StyledContainer>
  );
};

export { MainContainer };
