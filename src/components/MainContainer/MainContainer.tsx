import { FlexProps } from '@/component-library';
import { SiteInformation } from '@/components';

import { StyledContainer } from './MainContainer.styles';

type MainContainerProps = FlexProps;

const MainContainer = ({ direction = 'column', gap = 'spacing8', ...props }: MainContainerProps): JSX.Element => {
  const showSiteInformationMessage = !!process.env.REACT_APP_SITE_INFORMATION_MESSAGE;

  return (
    <StyledContainer direction={direction} gap={gap} {...props}>
      {showSiteInformationMessage && <SiteInformation />}
      {props.children}
    </StyledContainer>
  );
};

export { MainContainer };
