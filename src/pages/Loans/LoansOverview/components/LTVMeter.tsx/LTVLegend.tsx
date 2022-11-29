import { ReactComponent as InformationCircleIcon } from '@/assets/img/hero-icons/information-circle.svg';
import { Flex, Span, Tooltip } from '@/component-library';

import { LTVLegendStatus, StyledLegend } from './LTVMeter.style';

type LTVLegendProps = {
  status: LTVLegendStatus;
  label: string;
  description: string;
};

const LTVLegend = ({ status, label, description }: LTVLegendProps): JSX.Element => (
  <Flex gap='spacing2'>
    <StyledLegend $status={status} />
    <Span>{label}</Span>
    <Tooltip label={description}>
      <InformationCircleIcon />
    </Tooltip>
  </Flex>
);

export { LTVLegend };
export type { LTVLegendProps };
