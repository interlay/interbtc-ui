import { Alert, TextLink } from '@/component-library';

import { StyledContainer } from './SiteInformation.styles';

const SiteInformation = (): JSX.Element => {
  const hasLink = !!process.env.REACT_APP_SITE_INFORMATION_LINK;

  return (
    <StyledContainer>
      <Alert status='warning'>
        {process.env.REACT_APP_SITE_INFORMATION_MESSAGE}
        {hasLink && (
          <>
            {' '}
            <TextLink external icon to={process.env.REACT_APP_SITE_INFORMATION_LINK || ''}>
              More information
            </TextLink>
          </>
        )}
      </Alert>
    </StyledContainer>
  );
};

export { SiteInformation };
