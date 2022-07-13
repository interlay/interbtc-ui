import styled from 'styled-components';

import { theme } from '..';
import { StackProps } from '.';

const getSpacing = (spacing: StackProps['spacing']) => {
  let result;
  switch (spacing) {
    case 'half':
      result = theme.spacing.spacing2;
      break;
    case 'single':
      result = theme.spacing.spacing4;
      break;
    case 'double':
      result = theme.spacing.spacing4;
      break;
    default:
      throw new Error('Something went wrong!');
  }

  return result;
};

export const StackContainer = styled.div<StackProps>`
  > *:not(:last-child) {
    margin-bottom: ${(props) => getSpacing(props.spacing)};
  }
`;
