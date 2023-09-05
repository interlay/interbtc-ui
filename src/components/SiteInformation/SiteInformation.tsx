import { Alert, TextLink } from '@/component-library';

const SiteInformation = (): JSX.Element => {
  const hasLink = !!process.env.REACT_APP_SITE_INFORMATION_LINK;

  return (
    <Alert status='warning'>
      {process.env.REACT_APP_SITE_INFORMATION_MESSAGE}
      {hasLink && (
        <>
          {' '}
          <TextLink weight='bold' external icon to={process.env.REACT_APP_SITE_INFORMATION_LINK || ''}>
            More information
          </TextLink>
        </>
      )}
    </Alert>
  );
};

export { SiteInformation };
