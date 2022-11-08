// ray test touch <
import styled from 'styled-components';

import { Card, theme } from '@/component-library';
import { hideScrollbar } from '@/component-library/css';

const Wrapper = styled(Card)`
  padding: 0 0 ${theme.spacing.spacing8} 0;
  overflow: auto;
  ${hideScrollbar()}
`;

export { Wrapper };
// ray test touch >
