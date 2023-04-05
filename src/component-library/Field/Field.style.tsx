import styled from 'styled-components';

import { Flex } from '../Flex';
import { theme } from '../theme';

const Wrapper = styled(Flex)`
  position: relative;
  color: ${theme.colors.textPrimary};
  box-sizing: border-box;
`;

export { Wrapper };
