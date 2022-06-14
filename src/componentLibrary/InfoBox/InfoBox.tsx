import { InfoBoxHeader, InfoBoxText } from './InfoBox.style';

interface InfoBoxProps {
  title: string;
  text: string;
  onSubmit?: () => void;
}

const InfoBox = ({ title, text, onSubmit }: InfoBoxProps): JSX.Element => {
  return (
    <div>
      <InfoBoxHeader>{title}</InfoBoxHeader>
      <InfoBoxText>{text}</InfoBoxText>
      {onSubmit && <p>Click handler here</p>}
    </div>
  );
};

export { InfoBox };
export type { InfoBoxProps };
