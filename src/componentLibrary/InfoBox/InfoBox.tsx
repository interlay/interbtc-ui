import { CTA } from '../CTA';

import { InfoBoxWrapper, InfoBoxHeader, InfoBoxText } from './InfoBox.style';

interface InfoBoxProps {
  title: string;
  text: string;
  ctaText?: string;
  ctaOnClick?: () => void;
}

const InfoBox = ({ title, text, ctaText, ctaOnClick }: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
      <div>
        <InfoBoxHeader>{title}</InfoBoxHeader>
        <InfoBoxText>{text}</InfoBoxText>
      </div>
      {ctaOnClick && (
        <div>
          <CTA variant='primary' onClick={ctaOnClick}>
            {ctaText}
          </CTA>
        </div>
      )}
    </InfoBoxWrapper>
  );
};

export { InfoBox };
export type { InfoBoxProps };
