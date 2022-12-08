import styled from 'styled-components';

import { Meter, Span, theme } from '@/component-library';

const StyledMeterWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.spacing4};
`;

const StyledMeterScore = styled(Span)`
  flex: 0 0 ${theme.spacing.spacing4};
`;

const StyledMeter = styled(Meter)`
  flex: 1 1 auto;
`;

export { StyledMeter, StyledMeterScore, StyledMeterWrapper };
