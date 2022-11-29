import { Flex } from '@/component-library';
import { LTVLegendStatus, StyledLegend } from './LTVSection.style';

type LTVLegendProps = {
  status: LTVLegendStatus;
  label: string;
};

const LTVLegend = ({ status, label }: LTVLegendProps): JSX.Element => {
  return (
    <Flex>
      <StyledLegend $status={status} />
      <Span>{label}</Span>
    </Flex>
  );
};
export { LTVLegend };
export type { LTVLegendProps };
