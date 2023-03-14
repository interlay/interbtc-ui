import { InformationCircle } from '@/assets/icons';
import { Flex, Tooltip } from '@/component-library';

import { LTVLegendStatus, StyledLabel, StyledLegend } from './LTVMeter.style';

type LTVLegendProps = {
  status: LTVLegendStatus;
  label: string;
  description: string;
};

const LTVLegend = ({ status, label, description }: LTVLegendProps): JSX.Element => (
  <Flex gap='spacing2' alignItems='center'>
    <StyledLegend $status={status} />
    <StyledLabel>{label}</StyledLabel>
    <Tooltip label={description}>
      <InformationCircle size='s' />
    </Tooltip>
  </Flex>
);

export { LTVLegend };
export type { LTVLegendProps };
