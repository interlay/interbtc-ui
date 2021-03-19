// ray test touch <
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

interface Props {
  text: string;
  children: React.ReactElement;
}

function AppTooltip({
  text,
  children
}: Props) {
  const renderTooltip = (props: any) => (
    <Tooltip
      id='button-tooltip'
      {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
}

export default AppTooltip;
// ray test touch >
