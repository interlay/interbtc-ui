import { ReactElement } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type AppTooltipProps = {
  text: string;
  children: ReactElement;
};

export default function AppTooltip(properties: AppTooltipProps): ReactElement {
  // eslint-disable-next-line
    const renderTooltip = (props: any) => (
    <Tooltip
      id='button-tooltip'
      {...props}>
      {properties.text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}>
      {properties.children}
    </OverlayTrigger>
  );
}
