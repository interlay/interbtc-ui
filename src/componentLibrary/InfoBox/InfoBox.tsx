import { CTA } from '../CTA';

import { InfoBoxWrapper, InfoBoxHeader, InfoBoxText } from './InfoBox.style';

interface InfoBoxProps {
  title: string;
  text: string;
  ctaText?: string;
  ctaAction?: () => void;
}

const InfoBox = ({ title, text, ctaText, ctaAction }: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
      <div>
        <InfoBoxHeader>{title}</InfoBoxHeader>
        <InfoBoxText>{text}</InfoBoxText>
      </div>
      {ctaAction && (
        <div>
          <CTA variant='primary' onSubmit={ctaAction}>
            {ctaText}
          </CTA>
        </div>
      )}
    </InfoBoxWrapper>
  );
};

export { InfoBox };
export type { InfoBoxProps };
