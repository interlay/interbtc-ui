import styled from 'styled-components';

import { BaseTextProps, resolveTextColor } from '..';

const EmText = styled.em<BaseTextProps>`
  color: ${({ color }) => resolveTextColor(color)};
  font-style: italic;
`;

export { EmText };
