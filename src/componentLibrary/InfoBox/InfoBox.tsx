import { CTA } from '../CTA';

import { InfoBoxWrapper, InfoBoxHeader, InfoBoxText } from './InfoBox.style';

interface InfoBoxProps {
  title: string;
  text: string;
  onSubmit?: () => void;
}

const InfoBox = ({ title, text, onSubmit }: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
      <div>
        <InfoBoxHeader>{title}</InfoBoxHeader>
        <InfoBoxText>{text}</InfoBoxText>
      </div>
      {onSubmit && (
        <div>
          <CTA variant='primary'>Claim</CTA>
        </div>
      )}
    </InfoBoxWrapper>
  );
};

export { InfoBox };
export type { InfoBoxProps };
