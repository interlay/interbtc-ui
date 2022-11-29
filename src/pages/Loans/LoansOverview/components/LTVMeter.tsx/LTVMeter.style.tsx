import styled from 'styled-components';

import { Status, theme } from '@/component-library';

type LTVLegendStatus = Exclude<Status, 'success'> | 'info';

type StyledLegendProps = {
  $status: LTVLegendStatus;
};

const StyledLegend = styled.span<StyledLegendProps>`
  width: 0;
  height: 0;
  border: 2px solid
    ${({ $status }) => ($status === 'info' ? theme.meter.bar.indicator.color : theme.alert.status[$status])};
`;

export { StyledLegend };
export type { LTVLegendStatus };
