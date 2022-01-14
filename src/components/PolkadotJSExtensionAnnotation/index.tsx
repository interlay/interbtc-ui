
import InfoMessage from 'components/InfoMessage';
import InterlayLink from 'components/UI/InterlayLink';

const PolkadotJSExtensionAnnotation = (): JSX.Element => (
  <InfoMessage className='text-base'>
    Add your account with the&nbsp;
    <InterlayLink
      className='underline'
      target='_blank'
      rel='noopener noreferrer'
      href='https://polkadot.js.org/extension'>
      Polkadot JS Extension
    </InterlayLink>
    .
  </InfoMessage>
);

export default PolkadotJSExtensionAnnotation;
