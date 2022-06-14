import { InfoBoxWrapper, InfoBoxHeader, InfoBoxText } from './InfoBox.style';

interface InfoBoxProps {
  title: string;
  text: string;
  onSubmit?: () => void;
}

const InfoBox = ({ title, text, onSubmit }: InfoBoxProps): JSX.Element => {
  return (
    <InfoBoxWrapper>
      <InfoBoxHeader>{title}</InfoBoxHeader>
      <InfoBoxText>{text}</InfoBoxText>
      {onSubmit && <p>Click handler here</p>}
    </InfoBoxWrapper>
  );
};

export { InfoBox };
export type { InfoBoxProps };
