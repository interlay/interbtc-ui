import styled from 'styled-components';

import { ReactComponent as InformationCircleIcon } from '@/assets/img/hero-icons/information-circle.svg';
import { Span, Status, theme } from '@/component-library';

type LTVLegendStatus = Exclude<Status, 'success'> | 'info';

type StyledLegendProps = {
  $status: LTVLegendStatus;
};

const StyledLegend = styled.span<StyledLegendProps>`
  width: 0;
  height: 0;
  border: 4px solid
    ${({ $status }) => ($status === 'info' ? theme.meter.bar.indicator.color : theme.alert.status[$status])};
  border-radius: ${theme.rounded.full};
`;

const StyledLabel = styled(Span)`
  font-size: ${theme.text.xs};
  white-space: nowrap;
  font-weight: ${theme.fontWeight.semibold};
`;

const StyledIcon = styled(InformationCircleIcon)`
  width: ${theme.text.s};
  color: ${theme.colors.textPrimary};
`;

export { StyledIcon, StyledLabel, StyledLegend };
export type { LTVLegendStatus };
